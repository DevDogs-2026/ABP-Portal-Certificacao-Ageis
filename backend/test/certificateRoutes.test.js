const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const express = require('express');
const pool = require('../src/db/pool');

let servidor;
let baseUrl;
const queryOriginal = pool.query;
const connectOriginal = pool.connect;
let certificadoEmitido = null;
let resultadoAprovado = true;
let insercoes = 0;

pool.query = async (sql, parametros = []) => {
    assert.match(sql, /WHERE cert\.codigo_validacao = \$1/);
    if (!certificadoEmitido || parametros[0] !== certificadoEmitido.codigo_validacao || !resultadoAprovado) {
        return { rows: [], rowCount: 0 };
    }

    return {
        rows: [{
            codigo_validacao: certificadoEmitido.codigo_validacao,
            data_emissao: certificadoEmitido.data_emissao,
            titulo: 'Metodologias Ágeis',
            nome_completo: 'Candidata de Teste',
            cpf: 'dado-privado',
            email: 'privado@example.test',
            aproveitamento_percentual: 80,
            aprovado: true,
        }],
        rowCount: 1,
    };
};

pool.connect = async () => ({
    async query(sql, parametros = []) {
        if (sql === 'BEGIN' || sql === 'COMMIT' || sql === 'ROLLBACK') {
            return { rows: [], rowCount: 0 };
        }

        if (sql.includes('FROM resultado r')) {
            return resultadoAprovado
                ? {
                    rows: [{
                        id_resultado: 9,
                        total_acertos: 10,
                        total_questoes: 12,
                        aproveitamento_percentual: 80,
                        nota_final: 80,
                        data_conclusao: '2026-11-12T10:00:00.000Z',
                        titulo: 'Metodologias Ágeis',
                        nome_completo: 'Candidata de Teste',
                    }],
                    rowCount: 1,
                }
                : { rows: [], rowCount: 0 };
        }

        if (sql.includes('FROM certificado')) {
            return certificadoEmitido
                ? { rows: [certificadoEmitido], rowCount: 1 }
                : { rows: [], rowCount: 0 };
        }

        if (sql.includes('INSERT INTO certificado')) {
            insercoes += 1;
            certificadoEmitido = {
                codigo_validacao: parametros[1],
                data_emissao: '2026-11-12T10:00:00.000Z',
            };
            return { rows: [certificadoEmitido], rowCount: 1 };
        }

        throw new Error('Consulta inesperada na transação do teste: ' + sql);
    },
    release() {},
});

before(async () => {
    const app = express();
    app.use((req, res, next) => {
        req.session = req.get('x-candidate-id')
            ? { candidato: { id: Number(req.get('x-candidate-id')), nome: 'Candidata de Teste' } }
            : {};
        next();
    });
    app.use('/api/certificates', require('../src/routes/certificateRoutes'));
    app.use((error, req, res, next) => {
        res.status(error.status || 500).json({ mensagem: error.message });
    });

    servidor = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => servidor.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${servidor.address().port}/api/certificates`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        servidor.close((error) => error ? reject(error) : resolve());
    });
    pool.query = queryOriginal;
    pool.connect = connectOriginal;
});

test('emite um código forte uma única vez para a aprovação do candidato', async () => {
    const headers = { 'x-candidate-id': '1' };
    const primeiraResposta = await fetch(`${baseUrl}/me`, { headers });
    const primeiroCertificado = (await primeiraResposta.json()).certificado;
    const segundaResposta = await fetch(`${baseUrl}/me`, { headers });
    const segundoCertificado = (await segundaResposta.json()).certificado;

    assert.equal(primeiraResposta.status, 200);
    assert.match(primeiroCertificado.codigo, /^MA-(?:[A-F0-9]{8}-){3}[A-F0-9]{8}$/);
    assert.deepEqual(segundoCertificado, primeiroCertificado);
    assert.equal(insercoes, 1);
    assert.equal(primeiroCertificado.acertos, 80);
});

test('não emite certificado para resultado reprovado', async () => {
    resultadoAprovado = false;
    const resposta = await fetch(`${baseUrl}/me`, {
        headers: { 'x-candidate-id': '2' },
    });

    assert.equal(resposta.status, 200);
    assert.deepEqual(await resposta.json(), { certificado: null });
    resultadoAprovado = true;
});

test('exige sessão para emitir ou consultar o certificado do candidato', async () => {
    const resposta = await fetch(`${baseUrl}/me`);
    assert.equal(resposta.status, 401);
});

test('validação pública retorna somente dados necessários e omite CPF e email', async () => {
    const resposta = await fetch(
        `${baseUrl}/verify?codigo=${encodeURIComponent(certificadoEmitido.codigo_validacao)}`,
    );
    const dados = await resposta.json();

    assert.equal(resposta.status, 200);
    assert.deepEqual(Object.keys(dados.certificado).sort(), [
        'codigo',
        'curso',
        'emitidoEm',
        'nome',
    ]);
    assert.equal(JSON.stringify(dados).includes('cpf'), false);
    assert.equal(JSON.stringify(dados).includes('email'), false);
});

test('rejeita código inválido antes de consultar o banco', async () => {
    const resposta = await fetch(`${baseUrl}/verify?codigo=MA-INVALIDO`);
    assert.equal(resposta.status, 400);
});
