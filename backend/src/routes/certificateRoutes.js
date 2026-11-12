const { randomBytes } = require('node:crypto');
const express = require('express');
const pool = require('../db/pool');
const exigirAutenticacao = require('../middlewares/exigirAutenticacao');

const router = express.Router();

function gerarCodigoValidacao() {
    const identificador = randomBytes(16).toString('hex').toUpperCase();
    const grupos = identificador.match(/.{8}/g);
    return `MA-${grupos.join('-')}`;
}

function normalizarCodigoValidacao(valor) {
    if (typeof valor !== 'string') return null;

    const codigo = valor.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!/^MA[A-F0-9]{32}$/.test(codigo)) return null;

    const grupos = codigo.slice(2).match(/.{8}/g);
    return `MA-${grupos.join('-')}`;
}

async function emitirCertificadoMaisRecente(idCandidato) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const resultado = await client.query(
            `SELECT r.id_resultado, r.total_acertos, r.total_questoes,
                    r.aproveitamento_percentual, r.nota_final, r.data_conclusao,
                    c.titulo, candidato.nome_completo
             FROM resultado r
             JOIN tentativa_certificacao t USING (id_tentativa)
             JOIN certificacao c USING (id_certificacao)
             JOIN candidato ON candidato.id_candidato = t.id_candidato
             WHERE t.id_candidato = $1 AND r.aprovado = TRUE
             ORDER BY r.data_conclusao DESC
             LIMIT 1
             FOR UPDATE OF r`,
            [idCandidato]
        );

        if (!resultado.rowCount) {
            await client.query('COMMIT');
            return null;
        }

        const dados = resultado.rows[0];
        let certificado = await client.query(
            `SELECT codigo_validacao, data_emissao
             FROM certificado
             WHERE id_resultado = $1`,
            [dados.id_resultado]
        );

        if (!certificado.rowCount) {
            certificado = await client.query(
                `INSERT INTO certificado (id_resultado, codigo_validacao)
                 VALUES ($1, $2)
                 RETURNING codigo_validacao, data_emissao`,
                [dados.id_resultado, gerarCodigoValidacao()]
            );
        }

        await client.query('COMMIT');
        return formatarCertificado(dados, certificado.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

function formatarCertificado(dados, certificado) {
    return {
        codigo: certificado.codigo_validacao,
        nome: dados.nome_completo,
        curso: dados.titulo,
        acertos: Number(dados.aproveitamento_percentual),
        nota: Number(dados.nota_final),
        emitidoEm: certificado.data_emissao,
    };
}

router.get('/verify', async (req, res, next) => {
    const codigo = normalizarCodigoValidacao(req.query.codigo);
    if (!codigo) {
        return res.status(400).json({ mensagem: 'Código de validação inválido.' });
    }

    try {
        const consulta = await pool.query(
            `SELECT cert.codigo_validacao, cert.data_emissao,
                    c.titulo, candidato.nome_completo,
                    r.aproveitamento_percentual, r.aprovado
             FROM certificado cert
             JOIN resultado r USING (id_resultado)
             JOIN tentativa_certificacao t USING (id_tentativa)
             JOIN certificacao c USING (id_certificacao)
             JOIN candidato ON candidato.id_candidato = t.id_candidato
             WHERE cert.codigo_validacao = $1`,
            [codigo]
        );

        if (!consulta.rowCount || !consulta.rows[0].aprovado) {
            return res.status(404).json({ mensagem: 'Certificado não encontrado.' });
        }

        const dados = consulta.rows[0];
        return res.json({
            certificado: {
                codigo: dados.codigo_validacao,
                nome: dados.nome_completo,
                curso: dados.titulo,
                emitidoEm: dados.data_emissao,
            },
        });
    } catch (error) {
        return next(error);
    }
});

router.get('/me', exigirAutenticacao, async (req, res, next) => {
    try {
        const certificado = await emitirCertificadoMaisRecente(req.candidato.id);
        return res.json({ certificado });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
