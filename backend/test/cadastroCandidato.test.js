const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const pool = require('../src/db/pool');
const authRoutes = require('../src/routes/authRoutes');

describe('POST /api/candidatos - Cadastro seguro de candidatos', () => {
  let server;
  let baseUrl;
  let queryOriginal;
  let ultimosValoresSql;
  let ultimoSql;

  before(async () => {
    queryOriginal = pool.query;

    const app = express();
    app.use(express.json());
    app.use('/api', authRoutes);
    app.use((err, req, res, next) => {
      res.status(500).json({ erro: 'Erro interno', mensagem: err.message });
    });

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const { port } = server.address();
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  beforeEach(() => {
    ultimosValoresSql = null;
    ultimoSql = null;
    pool.query = async (_sql, values) => {
      ultimoSql = _sql;
      ultimosValoresSql = values;
      return {
        rows: [
          {
            id_candidato: 1,
            cpf: values[0],
            nome_completo: values[1],
            email: values[2],
          },
        ],
      };
    };
  });

  after(async () => {
    pool.query = queryOriginal;
    await new Promise((resolve) => server.close(resolve));
  });

  it('Cenário válido: deve cadastrar candidato (201) e salvar senha com hash bcrypt', async () => {
    const resposta = await fetch(`${baseUrl}/api/candidatos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: '529.982.247-25',
        nome_completo: 'Maria Silva',
        email: 'Maria@Teste.com',
        senha: 'SenhaForte123',
      }),
    });

    const dados = await resposta.json();

    assert.equal(resposta.status, 201);
    assert.equal(dados.candidato.cpf, '52998224725');
    assert.equal(dados.candidato.email, 'maria@teste.com');
    assert.equal(dados.candidato.senha_hash, undefined);

    // Garante que a senha enviada ao SQL foi criptografada e nunca em texto puro
    assert.ok(ultimosValoresSql);
    assert.match(ultimoSql, /INSERT INTO candidato/i);
    assert.match(ultimoSql, /VALUES \(\$1, \$2, \$3, \$4\)/);
    assert.notEqual(ultimosValoresSql[3], 'SenhaForte123');
    assert.match(ultimosValoresSql[3], /^\$2[aby]\$/);
  });

  it('Cenário inválido: deve rejeitar campos obrigatórios ausentes (400)', async () => {
    const resposta = await fetch(`${baseUrl}/api/candidatos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: '52998224725',
        email: 'maria@teste.com',
      }),
    });

    const dados = await resposta.json();

    assert.equal(resposta.status, 400);
    assert.ok(dados.mensagem);
  });

  it('Cenário inválido: deve rejeitar CPF inválido ou senha curta (400)', async () => {
    const respostaCpfInvalido = await fetch(`${baseUrl}/api/candidatos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: '11111111111',
        nome_completo: 'Maria Silva',
        email: 'maria@teste.com',
        senha: 'SenhaForte123',
      }),
    });

    assert.equal(respostaCpfInvalido.status, 400);

    const respostaSenhaCurta = await fetch(`${baseUrl}/api/candidatos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: '52998224725',
        nome_completo: 'Maria Silva',
        email: 'maria@teste.com',
        senha: '123',
      }),
    });

    assert.equal(respostaSenhaCurta.status, 400);
  });

  it('Cenário inválido: rejeita caracteres estranhos no CPF e senha acima de 72 bytes (400)', async () => {
    const base = {
      cpf: '52998224725',
      nome_completo: 'Maria Silva',
      email: 'maria@teste.com',
      senha: 'SenhaForte123',
    };

    const respostaCpf = await fetch(`${baseUrl}/api/candidatos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...base, cpf: 'abc52998224725' }),
    });
    assert.equal(respostaCpf.status, 400);

    const respostaSenha = await fetch(`${baseUrl}/api/candidatos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...base, senha: 'A'.repeat(73) }),
    });
    assert.equal(respostaSenha.status, 400);
  });

  it('Cenário inválido: deve rejeitar e-mail e nome fora do padrão (400)', async () => {
    const base = {
      cpf: '52998224725',
      nome_completo: 'Maria Silva',
      email: 'maria@teste.com',
      senha: 'SenhaForte123',
    };

    const respostaEmail = await fetch(`${baseUrl}/api/candidatos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...base, email: 'email-invalido' }),
    });
    assert.equal(respostaEmail.status, 400);

    const respostaNome = await fetch(`${baseUrl}/api/candidatos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...base, nome_completo: 'A' }),
    });
    assert.equal(respostaNome.status, 400);
  });

  it('Cenário duplicado: deve retornar 409 Conflict quando o CPF já existir no banco', async () => {
    pool.query = async () => {
      const erroDuplicado = new Error('duplicate key value violates unique constraint');
      erroDuplicado.code = '23505';
      throw erroDuplicado;
    };

    const resposta = await fetch(`${baseUrl}/api/candidatos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cpf: '52998224725',
        nome_completo: 'Maria Silva',
        email: 'maria@teste.com',
        senha: 'SenhaForte123',
      }),
    });

    const dados = await resposta.json();

    assert.equal(resposta.status, 409);
    assert.match(dados.mensagem, /CPF/i);
  });
});