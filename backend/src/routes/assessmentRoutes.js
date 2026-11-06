const express = require('express');
const pool = require('../db/pool');
const exigirAutenticacao = require('../middlewares/exigirAutenticacao');
const calcularResultados = require('../services/calcularResultado');

const router = express.Router();
const TOTAL_QUESTOES = 12;
const TEMPO_POR_QUESTAO = 150;

router.use(exigirAutenticacao);

// Converte o identificador recebido pela URL em um inteiro positivo.
function lerIdPositivo(valor) {
    const id = Number(valor);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// Converte uma linha do banco no formato público usado pela tela de resultado.
function formatarResultado(linha) {
    return {
        idTentativa: Number(linha.id_tentativa),
        totalQuestoes: Number(linha.total_questoes),
        acertos: Number(linha.total_acertos),
        percentual: Number(linha.aproveitamento_percentual),
        aprovado: linha.aprovado,
        concluidoEm: linha.data_conclusao,
    };
}

// Executa uma operação de banco como transação e sempre libera a conexão.
async function executarTransacao(operacao) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const resultado = await operacao(client);
        await client.query('COMMIT');
        return resultado;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// Cria uma tentativa ou informa a tentativa ainda aberta do candidato autenticado.
async function iniciarTentativa(req, res, next) {
    try {
        const tentativa = await executarTransacao(async (client) => {
            await client.query(
                'SELECT id_candidato FROM candidato WHERE id_candidato = $1 FOR UPDATE',
                [req.candidato.id]
            );

            const existente = await client.query(
                `SELECT id_tentativa
                 FROM tentativa_certificacao
                 WHERE id_candidato = $1 AND status_tentativa = 'em_andamento'
                 ORDER BY iniciada_em DESC
                 LIMIT 1`,
                [req.candidato.id]
            );

            if (existente.rowCount) {
                return {
                    idTentativa: Number(existente.rows[0].id_tentativa),
                    retomada: true,
                };
            }

            const certificacao = await client.query(
                `SELECT id_certificacao
                 FROM certificacao
                 WHERE ativa = TRUE
                 ORDER BY id_certificacao
                 LIMIT 1`
            );

            if (!certificacao.rowCount) {
                const error = new Error('Não há certificação ativa para iniciar.');
                error.status = 503;
                throw error;
            }

            const questoes = await client.query(
                `SELECT DISTINCT ON (q.id_tema)
                    q.id_tema, q.id_questao
                 FROM questao q
                 JOIN tema t ON t.id_tema = q.id_tema
                 JOIN alternativa a ON a.id_questao = q.id_questao
                 GROUP BY q.id_tema, q.id_questao
                 HAVING COUNT(a.id_alternativa) = 4
                    AND COUNT(a.id_alternativa) FILTER (WHERE a.correta) = 1
                 ORDER BY q.id_tema, random()
                 LIMIT $1`,
                [TOTAL_QUESTOES]
            );

            if (questoes.rowCount !== TOTAL_QUESTOES) {
                const error = new Error('O banco precisa ter 12 temas com questões válidas.');
                error.status = 503;
                throw error;
            }

            const criada = await client.query(
                `INSERT INTO tentativa_certificacao
                    (id_certificacao, id_candidato, iniciada_em, status_tentativa)
                 VALUES ($1, $2, CURRENT_TIMESTAMP, 'em_andamento')
                 RETURNING id_tentativa`,
                [certificacao.rows[0].id_certificacao, req.candidato.id]
            );
            const idTentativa = Number(criada.rows[0].id_tentativa);

            for (const questao of questoes.rows) {
                await client.query(
                    `INSERT INTO progresso
                        (id_questao_sorteada, id_tema, id_tentativa, status_tema)
                     VALUES ($1, $2, $3, 'pendente')`,
                    [questao.id_questao, questao.id_tema, idTentativa]
                );
            }

            return { idTentativa, retomada: false };
        });

        return res.status(tentativa.retomada ? 200 : 201).json({
            ...tentativa,
            totalQuestoes: TOTAL_QUESTOES,
        });
    } catch (error) {
        return next(error);
    }
}

// Busca ou inicia o cronômetro da próxima questão ainda não respondida.
async function obterQuestaoAtual(req, res, next) {
    const idTentativa = lerIdPositivo(req.params.id);
    if (!idTentativa) {
        return res.status(400).json({ mensagem: 'Identificador de tentativa inválido.' });
    }

    try {
        const resultado = await executarTransacao(async (client) => {
            const tentativa = await client.query(
                `SELECT status_tentativa
                 FROM tentativa_certificacao
                 WHERE id_tentativa = $1 AND id_candidato = $2
                 FOR UPDATE`,
                [idTentativa, req.candidato.id]
            );

            if (!tentativa.rowCount) {
                const error = new Error('Tentativa não encontrada.');
                error.status = 404;
                throw error;
            }

            if (tentativa.rows[0].status_tentativa === 'concluida') {
                const final = await client.query(
                    `SELECT id_tentativa, total_questoes, total_acertos,
                            aproveitamento_percentual, aprovado, data_conclusao
                     FROM resultado
                     WHERE id_tentativa = $1`,
                    [idTentativa]
                );
                return { concluida: true, resultado: formatarResultado(final.rows[0]) };
            }

            const progresso = await client.query(
                `SELECT p.id_progresso, p.id_questao_sorteada, p.id_tema,
                        p.iniciado_em, t.nome_tema, q.enunciado, q.imagem_url
                 FROM progresso p
                 JOIN tema t ON t.id_tema = p.id_tema
                 JOIN questao q ON q.id_questao = p.id_questao_sorteada
                 WHERE p.id_tentativa = $1
                   AND NOT EXISTS (
                       SELECT 1 FROM resposta_candidato r
                       WHERE r.id_progresso = p.id_progresso
                   )
                 ORDER BY p.id_tema
                 LIMIT 1
                 FOR UPDATE OF p`,
                [idTentativa]
            );

            if (!progresso.rowCount) {
                const error = new Error('A tentativa não possui questões pendentes.');
                error.status = 409;
                throw error;
            }

            const atual = progresso.rows[0];
            await client.query(
                `UPDATE progresso
                 SET iniciado_em = COALESCE(iniciado_em, CURRENT_TIMESTAMP)
                 WHERE id_progresso = $1
                 RETURNING iniciado_em`,
                [atual.id_progresso]
            );
            const alternativas = await client.query(
                `SELECT id_alternativa, letra, texto_alternativa
                 FROM alternativa
                 WHERE id_questao = $1
                 ORDER BY letra`,
                [atual.id_questao_sorteada]
            );

            if (alternativas.rowCount !== 4) {
                const error = new Error('A questão não possui quatro alternativas válidas.');
                error.status = 503;
                throw error;
            }

            const tempo = await client.query(
                `SELECT GREATEST(
                    0,
                    $2 - FLOOR(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - iniciado_em)))::integer
                 ) AS restante
                 FROM progresso
                 WHERE id_progresso = $1`,
                [atual.id_progresso, TEMPO_POR_QUESTAO]
            );
            const respondidas = await client.query(
                'SELECT COUNT(*)::integer AS total FROM resposta_candidato r JOIN progresso p USING (id_progresso) WHERE p.id_tentativa = $1',
                [idTentativa]
            );

            return {
                concluida: false,
                idTentativa,
                numeroQuestao: Number(respondidas.rows[0].total) + 1,
                totalQuestoes: TOTAL_QUESTOES,
                restanteSegundos: Number(tempo.rows[0].restante),
                questao: {
                    id: Number(atual.id_questao_sorteada),
                    tema: atual.nome_tema,
                    enunciado: atual.enunciado,
                    imagemUrl: atual.imagem_url,
                    alternativas: alternativas.rows.map((alternativa) => ({
                        id: Number(alternativa.id_alternativa),
                        letra: alternativa.letra.trim(),
                        texto: alternativa.texto_alternativa,
                    })),
                },
            };
        });

        return res.json(resultado);
    } catch (error) {
        return next(error);
    }
}

// Valida a alternativa no banco e registra o resultado da questão sem confiar no navegador.
async function registrarResposta(req, res, next) {
    const idTentativa = lerIdPositivo(req.params.id);
    if (!idTentativa) {
        return res.status(400).json({ mensagem: 'Identificador de tentativa inválido.' });
    }

    const idAlternativa = req.body?.idAlternativa;
    if (idAlternativa !== null && idAlternativa !== undefined &&
        (!Number.isSafeInteger(idAlternativa) || idAlternativa <= 0)) {
        return res.status(400).json({ mensagem: 'Alternativa inválida.' });
    }

    try {
        const resposta = await executarTransacao(async (client) => {
            const tentativa = await client.query(
                `SELECT status_tentativa
                 FROM tentativa_certificacao
                 WHERE id_tentativa = $1 AND id_candidato = $2
                 FOR UPDATE`,
                [idTentativa, req.candidato.id]
            );

            if (!tentativa.rowCount) {
                const error = new Error('Tentativa não encontrada.');
                error.status = 404;
                throw error;
            }
            if (tentativa.rows[0].status_tentativa !== 'em_andamento') {
                const error = new Error('A tentativa já foi concluída.');
                error.status = 409;
                throw error;
            }

            const pendente = await client.query(
                `SELECT p.id_progresso, p.id_questao_sorteada, p.iniciado_em
                 FROM progresso p
                 WHERE p.id_tentativa = $1
                   AND NOT EXISTS (
                       SELECT 1 FROM resposta_candidato r
                       WHERE r.id_progresso = p.id_progresso
                   )
                 ORDER BY p.id_tema
                 LIMIT 1
                 FOR UPDATE OF p`,
                [idTentativa]
            );
            if (!pendente.rowCount) {
                const error = new Error('Não há questão pendente para responder.');
                error.status = 409;
                throw error;
            }

            const atual = pendente.rows[0];
            if (!atual.iniciado_em) {
                await client.query(
                    `UPDATE progresso
                     SET iniciado_em = CURRENT_TIMESTAMP
                     WHERE id_progresso = $1`,
                    [atual.id_progresso]
                );
            }
            const decorrido = await client.query(
                `SELECT GREATEST(
                    0,
                    FLOOR(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - iniciado_em)))::integer
                 ) AS segundos
                 FROM progresso
                 WHERE id_progresso = $1`,
                [atual.id_progresso]
            );
            const expirou = Number(decorrido.rows[0].segundos) >= TEMPO_POR_QUESTAO;

            if (!expirou && idAlternativa == null) {
                const error = new Error('Selecione uma alternativa antes de confirmar.');
                error.status = 400;
                throw error;
            }

            let alternativaCorreta = null;
            let acertou = false;
            const alternativaRegistrada = expirou ? null : idAlternativa;

            if (alternativaRegistrada !== null) {
                const alternativa = await client.query(
                    `SELECT id_alternativa, letra, correta
                     FROM alternativa
                     WHERE id_alternativa = $1 AND id_questao = $2`,
                    [alternativaRegistrada, atual.id_questao_sorteada]
                );
                if (!alternativa.rowCount) {
                    const error = new Error('A alternativa não pertence à questão atual.');
                    error.status = 400;
                    throw error;
                }

                acertou = alternativa.rows[0].correta;
                const gabarito = await client.query(
                    'SELECT letra FROM alternativa WHERE id_questao = $1 AND correta = TRUE',
                    [atual.id_questao_sorteada]
                );
                alternativaCorreta = gabarito.rows[0]?.letra?.trim() || null;
            } else {
                const gabarito = await client.query(
                    'SELECT letra FROM alternativa WHERE id_questao = $1 AND correta = TRUE',
                    [atual.id_questao_sorteada]
                );
                alternativaCorreta = gabarito.rows[0]?.letra?.trim() || null;
            }

            await client.query(
                `INSERT INTO resposta_candidato
                    (id_alternativa_escolhida, id_progresso, inicio_questao,
                     encerramento_questao, tempo_utilizado_segundos, status_resposta, acertou)
                 SELECT $1, p.id_progresso, p.iniciado_em, CURRENT_TIMESTAMP, $3, $4, $5
                 FROM progresso p
                 WHERE p.id_progresso = $2`,
                [
                    alternativaRegistrada,
                    atual.id_progresso,
                    Math.min(Number(decorrido.rows[0].segundos), TEMPO_POR_QUESTAO),
                    expirou ? 'tempo_esgotado' : 'respondida',
                    acertou,
                ]
            );
            await client.query(
                `UPDATE progresso
                 SET status_tema = 'concluido', encerrado_em = CURRENT_TIMESTAMP
                 WHERE id_progresso = $1`,
                [atual.id_progresso]
            );

            const totais = await client.query(
                `SELECT COUNT(*)::integer AS respondidas,
                        COUNT(*) FILTER (WHERE r.acertou)::integer AS acertos
                 FROM resposta_candidato r
                 JOIN progresso p USING (id_progresso)
                 WHERE p.id_tentativa = $1`,
                [idTentativa]
            );

            if (Number(totais.rows[0].respondidas) === TOTAL_QUESTOES) {
                const calculado = calcularResultados(Number(totais.rows[0].acertos), TOTAL_QUESTOES);
                const salvo = await client.query(
                    `INSERT INTO resultado
                        (id_tentativa, total_acertos, total_questoes,
                         aproveitamento_percentual, nota_final, data_conclusao, aprovado)
                     VALUES ($1, $2, $3, $4, $4, CURRENT_TIMESTAMP, $5)
                     RETURNING id_tentativa, total_questoes, total_acertos,
                               aproveitamento_percentual, aprovado, data_conclusao`,
                    [
                        idTentativa,
                        calculado.acertos,
                        calculado.totalQuestoes,
                        calculado.percentual,
                        calculado.aprovado,
                    ]
                );
                await client.query(
                    `UPDATE tentativa_certificacao
                     SET status_tentativa = 'concluida', concluida_em = CURRENT_TIMESTAMP
                     WHERE id_tentativa = $1`,
                    [idTentativa]
                );

                return {
                    concluida: true,
                    correto: acertou,
                    alternativaCorreta,
                    resultado: formatarResultado(salvo.rows[0]),
                };
            }

            return { concluida: false, correto: acertou, alternativaCorreta };
        });

        return res.json(resposta);
    } catch (error) {
        return next(error);
    }
}

// Lista somente as tentativas do candidato autenticado para a página de progresso.
async function listarTentativas(req, res, next) {
    try {
        const consulta = await pool.query(
            `SELECT ta.id_tentativa, ta.status_tentativa, ta.iniciada_em, ta.concluida_em,
                    COUNT(DISTINCT p.id_progresso)::integer AS total_questoes,
                    COUNT(DISTINCT r.id_resposta)::integer AS respondidas,
                    COUNT(DISTINCT r.id_resposta) FILTER (WHERE r.acertou)::integer AS acertos,
                    resultado.aproveitamento_percentual, resultado.aprovado
             FROM tentativa_certificacao ta
             LEFT JOIN progresso p ON p.id_tentativa = ta.id_tentativa
             LEFT JOIN resposta_candidato r ON r.id_progresso = p.id_progresso
             LEFT JOIN resultado ON resultado.id_tentativa = ta.id_tentativa
             WHERE ta.id_candidato = $1
             GROUP BY ta.id_tentativa, resultado.id_resultado
             ORDER BY ta.iniciada_em DESC`,
            [req.candidato.id]
        );

        return res.json({
            tentativas: consulta.rows.map((linha) => ({
                id: Number(linha.id_tentativa),
                status: linha.status_tentativa,
                iniciadaEm: linha.iniciada_em,
                concluidaEm: linha.concluida_em,
                totalQuestoes: Number(linha.total_questoes),
                respondidas: Number(linha.respondidas),
                acertos: Number(linha.acertos),
                percentual: linha.aproveitamento_percentual === null
                    ? null
                    : Number(linha.aproveitamento_percentual),
                aprovado: linha.aprovado,
            })),
        });
    } catch (error) {
        return next(error);
    }
}

// Consulta o resultado final de uma tentativa pertencente ao candidato autenticado.
async function obterResultado(req, res, next) {
    const idTentativa = lerIdPositivo(req.params.id);
    if (!idTentativa) {
        return res.status(400).json({ mensagem: 'Identificador de tentativa inválido.' });
    }

    try {
        const consulta = await pool.query(
            `SELECT resultado.id_tentativa, resultado.total_questoes,
                    resultado.total_acertos, resultado.aproveitamento_percentual,
                    resultado.aprovado, resultado.data_conclusao
             FROM resultado
             JOIN tentativa_certificacao ta USING (id_tentativa)
             WHERE ta.id_tentativa = $1 AND ta.id_candidato = $2`,
            [idTentativa, req.candidato.id]
        );

        if (!consulta.rowCount) {
            return res.status(404).json({ mensagem: 'Resultado não encontrado.' });
        }

        return res.json({ resultado: formatarResultado(consulta.rows[0]) });
    } catch (error) {
        return next(error);
    }
}

router.post('/attempts', iniciarTentativa);
router.get('/attempts', listarTentativas);
router.get('/attempts/:id/current', obterQuestaoAtual);
router.post('/attempts/:id/answers', registrarResposta);
router.get('/attempts/:id/result', obterResultado);

module.exports = router;
