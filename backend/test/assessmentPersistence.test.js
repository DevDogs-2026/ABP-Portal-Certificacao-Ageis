const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const express = require('express');
const pool = require('../src/db/pool');

const tentativas = new Map([[42, { id_candidato: 1, status_tentativa: 'em_andamento' }]]);
const historico = new Map([
    [1, [{ id_tentativa: 42, status_tentativa: 'em_andamento', total_questoes: 12, respondidas: 3, acertos: 2 }]],
    [2, [{ id_tentativa: 84, status_tentativa: 'concluida', total_questoes: 12, respondidas: 12, acertos: 9 }]],
]);
let proximoIdTentativa = 100;
let insercoesProgresso = [];
let servidor;
let baseUrl;
const queryOriginal = pool.query;
const connectOriginal = pool.connect;

pool.query = async (sql, parametros = []) => {
    if (sql.includes('FROM tentativa_certificacao ta')) {
        return { rows: historico.get(parametros[0]) || [], rowCount: (historico.get(parametros[0]) || []).length };
    }

    throw new Error('Consulta inesperada no teste: ' + sql);
};

pool.connect = async () => ({
    async query(sql, parametros = []) {
        if (sql === 'BEGIN' || sql === 'COMMIT' || sql === 'ROLLBACK') {
            return { rows: [], rowCount: 0 };
        }

        if (sql.includes('SELECT id_candidato FROM candidato')) {
            return { rows: [{ id_candidato: parametros[0] }], rowCount: 1 };
        }

        if (sql.includes('SELECT id_tentativa') && sql.includes("status_tentativa = 'em_andamento'")) {
            const existente = [...tentativas.entries()].find(([, tentativa]) =>
                tentativa.id_candidato === parametros[0] && tentativa.status_tentativa === 'em_andamento',
            );
            return existente
                ? { rows: [{ id_tentativa: existente[0] }], rowCount: 1 }
                : { rows: [], rowCount: 0 };
        }

        if (sql.includes('SELECT id_certificacao')) {
            return { rows: [{ id_certificacao: 1 }], rowCount: 1 };
        }

        if (sql.includes('SELECT DISTINCT ON (q.id_tema)')) {
            return {
                rows: Array.from({ length: 12 }, (_, index) => ({
                    id_tema: index + 1,
                    id_questao: index + 1,
                })),
                rowCount: 12,
            };
        }

        if (sql.includes('INSERT INTO tentativa_certificacao')) {
            const id = proximoIdTentativa++;
            tentativas.set(id, { id_candidato: parametros[1], status_tentativa: 'em_andamento' });
            return { rows: [{ id_tentativa: id }], rowCount: 1 };
        }

        if (sql.includes('INSERT INTO progresso')) {
            insercoesProgresso.push(parametros);
            return { rows: [], rowCount: 1 };
        }

        if (sql.includes('SELECT status_tentativa')) {
            const tentativa = tentativas.get(parametros[0]);
            if (!tentativa || tentativa.id_candidato !== parametros[1]) {
                return { rows: [], rowCount: 0 };
            }
            return { rows: [{ status_tentativa: tentativa.status_tentativa }], rowCount: 1 };
        }

        throw new Error('Consulta inesperada na transação do teste: ' + sql);
    },
    release() {},
});

before(async () => {
    const app = express();
    app.use((req, res, next) => {
        const id = Number(req.get('x-candidate-id'));
        req.session = Number.isSafeInteger(id) && id > 0
            ? { candidato: { id, nome: `Candidato ${id}` } }
            : {};
        next();
    });
    app.use('/api/assessments', require('../src/routes/assessmentRoutes'));
    app.use((error, req, res, next) => {
        res.status(error.status || 500).json({ mensagem: error.message });
    });

    servidor = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => servidor.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${servidor.address().port}/api/assessments`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        servidor.close((error) => error ? reject(error) : resolve());
    });
    pool.query = queryOriginal;
    pool.connect = connectOriginal;
});

async function requisitar(caminho, { candidato, ...opcoes } = {}) {
    return fetch(`${baseUrl}${caminho}`, {
        ...opcoes,
        headers: {
            ...(opcoes.headers || {}),
            ...(candidato ? { 'x-candidate-id': String(candidato) } : {}),
        },
    });
}

test('exige sessão para acessar tentativas', async () => {
    const resposta = await requisitar('');
    assert.equal(resposta.status, 401);
});

test('filtra o histórico pelo candidato autenticado', async () => {
    const respostaCandidatoUm = await requisitar('/attempts', { candidato: 1 });
    const respostaCandidatoDois = await requisitar('/attempts', { candidato: 2 });
    const dadosUm = await respostaCandidatoUm.json();
    const dadosDois = await respostaCandidatoDois.json();

    assert.deepEqual(dadosUm.tentativas.map((tentativa) => tentativa.id), [42]);
    assert.deepEqual(dadosDois.tentativas.map((tentativa) => tentativa.id), [84]);
});

test('retoma somente a tentativa em andamento do mesmo candidato', async () => {
    const retomar = await requisitar('/attempts', {
        candidato: 1,
        method: 'POST',
    });
    const respostaRetomada = await retomar.json();

    assert.equal(retomar.status, 200);
    assert.equal(respostaRetomada.idTentativa, 42);
    assert.equal(respostaRetomada.retomada, true);

    const iniciar = await requisitar('/attempts', {
        candidato: 2,
        method: 'POST',
    });
    const respostaNova = await iniciar.json();

    assert.equal(iniciar.status, 201);
    assert.equal(respostaNova.idTentativa, 100);
    assert.equal(respostaNova.retomada, false);
    assert.equal(insercoesProgresso.length, 12);
    assert.ok(insercoesProgresso.every(([, , idTentativa]) => idTentativa === 100));
});

test('não permite consultar a tentativa pertencente a outro candidato', async () => {
    const resposta = await requisitar('/attempts/42/current', { candidato: 2 });
    const dados = await resposta.json();

    assert.equal(resposta.status, 404);
    assert.equal(dados.mensagem, 'Tentativa não encontrada.');
});
