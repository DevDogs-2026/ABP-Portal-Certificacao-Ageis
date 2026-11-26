const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const session = require('express-session');
const pool = require('../src/db/pool');
const authRoutes = require('../src/routes/authRoutes');
const assessmentRoutes = require('../src/routes/assessmentRoutes');

// Adaptador em memória para testar a integração HTTP entre Express, rotas,
// sessão e camada de persistência. Não substitui homologação com PostgreSQL real.
class BancoEmMemoria {
  constructor() {
    this.candidatos = [];
    this.tentativas = [];
    this.progressos = [];
    this.respostas = [];
    this.resultados = [];
    this.proximoCandidato = 1;
    this.proximaTentativa = 1;
    this.proximoProgresso = 1;
    this.elapsedSeconds = 5;
  }

  resultado(rows = []) { return { rows, rowCount: rows.length }; }

  async query(sql, values = []) {
    const q = sql.replace(/\s+/g, ' ').trim().toLowerCase();

    if (q.startsWith('insert into candidato')) {
      const [cpf, nome, email, senhaHash] = values;
      if (this.candidatos.some(c => c.cpf === cpf)) {
        const e = new Error('duplicate CPF'); e.code = '23505'; e.constraint = 'candidato_cpf_key'; throw e;
      }
      if (this.candidatos.some(c => c.email === email)) {
        const e = new Error('duplicate email'); e.code = '23505'; e.constraint = 'candidato_email_key'; throw e;
      }
      const c = { id_candidato: this.proximoCandidato++, cpf, nome_completo: nome, email, senha_hash: senhaHash };
      this.candidatos.push(c);
      return this.resultado([{ id_candidato: c.id_candidato, cpf, nome_completo: nome, email }]);
    }

    if (q.startsWith('select id_candidato, nome_completo, senha_hash from candidato')) {
      const c = this.candidatos.find(x => x.cpf === values[0]);
      return this.resultado(c ? [{ id_candidato: c.id_candidato, nome_completo: c.nome_completo, senha_hash: c.senha_hash }] : []);
    }

    if (q.includes('select id_candidato from candidato where id_candidato = $1 for update')) {
      return this.resultado(this.candidatos.some(c => c.id_candidato === values[0]) ? [{ id_candidato: values[0] }] : []);
    }

    if (q.includes('select id_tentativa from tentativa_certificacao') && q.includes("status_tentativa in ('em_andamento', 'pausada')")) {
      const t = this.tentativas.find(x => x.id_candidato === values[0] && ['em_andamento', 'pausada'].includes(x.status_tentativa));
      return this.resultado(t ? [{ id_tentativa: t.id_tentativa }] : []);
    }

    if (q.startsWith('select id_certificacao from certificacao')) return this.resultado([{ id_certificacao: 1 }]);

    if (q.startsWith('select distinct on (q.id_tema)')) {
      return this.resultado(Array.from({ length: 12 }, (_, i) => ({ id_tema: i + 1, id_questao: 101 + i })));
    }

    if (q.startsWith('insert into tentativa_certificacao')) {
      const t = { id_tentativa: this.proximaTentativa++, id_candidato: values[1], status_tentativa: 'em_andamento' };
      this.tentativas.push(t);
      return this.resultado([{ id_tentativa: t.id_tentativa }]);
    }

    if (q.startsWith('insert into progresso')) {
      const p = { id_progresso: this.proximoProgresso++, id_questao_sorteada: values[0], id_tema: values[1], id_tentativa: values[2], iniciado_em: null, status_tema: 'pendente' };
      this.progressos.push(p);
      return this.resultado([{ id_progresso: p.id_progresso }]);
    }

    if (q.startsWith('select status_tentativa from tentativa_certificacao')) {
      const t = this.tentativas.find(x => x.id_tentativa === values[0] && x.id_candidato === values[1]);
      return this.resultado(t ? [{ status_tentativa: t.status_tentativa }] : []);
    }

    if (q.startsWith("update tentativa_certificacao set status_tentativa = 'em_andamento'")) {
      const t = this.tentativas.find(x => x.id_tentativa === values[0]); if (t) t.status_tentativa = 'em_andamento';
      return this.resultado([]);
    }

    if (q.startsWith("update tentativa_certificacao set status_tentativa = 'pausada'")) {
      const t = this.tentativas.find(x => x.id_tentativa === values[0]); if (t) t.status_tentativa = 'pausada';
      return this.resultado([]);
    }

    if (q.startsWith("update tentativa_certificacao set status_tentativa = 'concluida'")) {
      const t = this.tentativas.find(x => x.id_tentativa === values[0]); if (t) t.status_tentativa = 'concluida';
      return this.resultado([]);
    }

    if (q.startsWith('select p.id_progresso, p.id_questao_sorteada, p.id_tema')) {
      const idTentativa = values[0];
      const p = this.progressos.find(x => x.id_tentativa === idTentativa && !this.respostas.some(r => r.id_progresso === x.id_progresso));
      if (!p) return this.resultado([]);
      return this.resultado([{
        id_progresso: p.id_progresso,
        id_questao_sorteada: p.id_questao_sorteada,
        id_tema: p.id_tema,
        iniciado_em: p.iniciado_em,
        nome_tema: `Tema ${p.id_tema}`,
        enunciado: `Questão ${p.id_tema}`,
        imagem_url: null,
      }]);
    }

    if (q.startsWith('select p.id_progresso, p.iniciado_em')) {
      const p = this.progressos.find(x => x.id_tentativa === values[0] && !this.respostas.some(r => r.id_progresso === x.id_progresso));
      return this.resultado(p ? [{ id_progresso: p.id_progresso, iniciado_em: p.iniciado_em }] : []);
    }

    if (q.startsWith('update progresso') && q.includes('coalesce(iniciado_em')) {
      const p = this.progressos.find(x => x.id_progresso === values[0]);
      if (p && !p.iniciado_em) p.iniciado_em = new Date();
      return this.resultado(p ? [{ iniciado_em: p.iniciado_em }] : []);
    }

    if (q.startsWith('update progresso') && q.includes('set iniciado_em = current_timestamp')) {
      const p = this.progressos.find(x => x.id_progresso === values[0]); if (p) p.iniciado_em = new Date();
      return this.resultado([]);
    }

    if (q.startsWith('select id_alternativa, letra, texto_alternativa from alternativa')) {
      const questao = values[0];
      return this.resultado(['A', 'B', 'C', 'D'].map((letra, i) => ({ id_alternativa: questao * 10 + i + 1, letra, texto_alternativa: `Alternativa ${letra}` })));
    }

    if (q.startsWith('select greatest(') && q.includes('as restante')) return this.resultado([{ restante: 150 }]);
    if (q.startsWith('select greatest(') && q.includes('as segundos')) return this.resultado([{ segundos: this.elapsedSeconds }]);

    if (q.startsWith('select count(*)::integer as total from resposta_candidato')) {
      const total = this.respostas.filter(r => this.progressos.find(p => p.id_progresso === r.id_progresso)?.id_tentativa === values[0]).length;
      return this.resultado([{ total }]);
    }

    if (q.startsWith('select p.id_progresso, p.id_questao_sorteada, p.iniciado_em')) {
      const p = this.progressos.find(x => x.id_tentativa === values[0] && !this.respostas.some(r => r.id_progresso === x.id_progresso));
      return this.resultado(p ? [{ id_progresso: p.id_progresso, id_questao_sorteada: p.id_questao_sorteada, iniciado_em: p.iniciado_em }] : []);
    }

    if (q.startsWith('select id_alternativa, letra, correta from alternativa')) {
      const idAlt = values[0], idQuestao = values[1];
      if (idAlt === idQuestao * 10 + 1) return this.resultado([{ id_alternativa: idAlt, letra: 'A', correta: true }]);
      if (idAlt >= idQuestao * 10 + 1 && idAlt <= idQuestao * 10 + 4) return this.resultado([{ id_alternativa: idAlt, letra: ['A','B','C','D'][idAlt - idQuestao * 10 - 1], correta: false }]);
      return this.resultado([]);
    }

    if (q.startsWith('select letra from alternativa')) return this.resultado([{ letra: 'A' }]);

    if (q.startsWith('insert into resposta_candidato')) {
      let idAlternativa, idProgresso, segundos, status, acertou;
      if (q.includes('select null, id_progresso')) {
        [idProgresso, segundos, status] = values;
        idAlternativa = null;
        acertou = false;
      } else {
        [idAlternativa, idProgresso, segundos, status, acertou] = values;
      }
      if (!this.respostas.some(r => r.id_progresso === idProgresso)) {
        this.respostas.push({ id_alternativa_escolhida: idAlternativa, id_progresso: idProgresso, tempo_utilizado_segundos: segundos, status_resposta: status, acertou });
      }
      return this.resultado([]);
    }

    if (q.startsWith('update progresso') && q.includes("set status_tema = 'concluido'")) {
      const p = this.progressos.find(x => x.id_progresso === values[0]); if (p) p.status_tema = 'concluido';
      return this.resultado([]);
    }

    if (q.startsWith('select count(*)::integer as respondidas')) {
      const ids = this.progressos.filter(p => p.id_tentativa === values[0]).map(p => p.id_progresso);
      const respostas = this.respostas.filter(r => ids.includes(r.id_progresso));
      return this.resultado([{ respondidas: respostas.length, acertos: respostas.filter(r => r.acertou).length }]);
    }

    if (q.startsWith('insert into resultado')) {
      const [idTentativa, acertos, total, percentual, aprovado] = values;
      const linha = { id_tentativa: idTentativa, total_questoes: total, total_acertos: acertos, aproveitamento_percentual: percentual, aprovado, data_conclusao: new Date() };
      this.resultados.push(linha);
      return this.resultado([linha]);
    }

    if (q.startsWith('select id_tentativa, total_questoes, total_acertos')) {
      return this.resultado(this.resultados.filter(r => r.id_tentativa === values[0]));
    }

    if (q.startsWith('select resultado.id_tentativa')) {
      const r = this.resultados.find(x => x.id_tentativa === values[0]);
      return this.resultado(r ? [r] : []);
    }

    if (q.startsWith('select ta.id_tentativa')) return this.resultado([]);
    if (q === 'begin' || q === 'commit' || q === 'rollback') return this.resultado([]);

    throw new Error(`SQL não tratado pelo adaptador de teste: ${sql}`);
  }

  async connect() {
    return { query: (sql, values) => this.query(sql, values), release() {} };
  }
}

describe('Sprint 03 — integração HTTP dos fluxos principais', () => {
  let server;
  let baseUrl;
  let cookie;
  let banco;
  let queryAnterior;
  let connectAnterior;

  async function requisitar(path, options = {}, sessao = true) {
    const headers = { ...(options.headers || {}) };
    if (sessao && cookie) headers.Cookie = cookie;
    const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
    const body = await response.text();
    let data = {};
    if (body) { try { data = JSON.parse(body); } catch { data = { mensagem: body }; } }
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) cookie = setCookie.split(';')[0];
    return { response, data };
  }

  async function cadastrarEAutenticar(cpf = '52998224725') {
    const cadastro = await requisitar('/api/candidatos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, nome_completo: 'Maria Silva', email: `${cpf}@teste.com`, senha: 'SenhaForte123' }),
    }, false);
    assert.equal(cadastro.response.status, 201);
    const login = await requisitar('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, senha: 'SenhaForte123' }),
    }, false);
    assert.equal(login.response.status, 200);
  }

  before(async () => {
    queryAnterior = pool.query;
    connectAnterior = pool.connect;
    banco = new BancoEmMemoria();
    pool.query = banco.query.bind(banco);
    pool.connect = banco.connect.bind(banco);

    const app = express();
    app.use(express.json());
    app.use(session({ secret: 'sprint03-test-secret', resave: false, saveUninitialized: false }));
    app.use('/api/auth', authRoutes);
    app.use('/api', authRoutes);
    app.use('/api/assessments', assessmentRoutes);
    app.use((err, req, res, next) => res.status(err.status || 500).json({ mensagem: err.message }));
    await new Promise(resolve => {
      server = app.listen(0, () => { baseUrl = `http://127.0.0.1:${server.address().port}`; resolve(); });
    });
  });

  after(async () => {
    pool.query = queryAnterior;
    pool.connect = connectAnterior;
    if (server) await new Promise(resolve => server.close(resolve));
  });

  it('integra cadastro, login e sessão autenticada', async () => {
    await cadastrarEAutenticar();
    const me = await requisitar('/api/auth/me');
    assert.equal(me.response.status, 200);
    assert.equal(me.data.usuario.nome, 'Maria Silva');
    assert.match(banco.candidatos[0].senha_hash, /^\$2[aby]\$/);
    assert.notEqual(banco.candidatos[0].senha_hash, 'SenhaForte123');
  });

  it('rejeita CPF duplicado e credenciais incorretas', async () => {
    const duplicado = await requisitar('/api/candidatos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: '52998224725', nome_completo: 'Outra Pessoa', email: 'outra@teste.com', senha: 'SenhaForte123' }),
    }, false);
    assert.equal(duplicado.response.status, 409);

    const login = await requisitar('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf: '52998224725', senha: 'SenhaErrada123' }),
    }, false);
    assert.equal(login.response.status, 401);
  });

  it('inicia avaliação, apresenta cronômetro e calcula nota no servidor', async () => {
    await cadastrarEAutenticar('10000000019');
    const inicio = await requisitar('/api/assessments/attempts', { method: 'POST' });
    assert.equal(inicio.response.status, 201);
    const id = inicio.data.idTentativa;

    for (let i = 0; i < 12; i++) {
      const atual = await requisitar(`/api/assessments/attempts/${id}/current`);
      assert.equal(atual.response.status, 200);
      assert.equal(atual.data.restanteSegundos, 150);
      assert.equal(atual.data.questao.alternativas.length, 4);
      const alternativaCorreta = atual.data.questao.alternativas[0];
      if (i === 0) {
        const alternativaDeOutraQuestao = await requisitar(`/api/assessments/attempts/${id}/answers`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idAlternativa: 999999 }),
        });
        assert.equal(alternativaDeOutraQuestao.response.status, 400);
      }
      const resposta = await requisitar(`/api/assessments/attempts/${id}/answers`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        // Campos falsos enviados pelo navegador não influenciam a pontuação.
        body: JSON.stringify({ idAlternativa: alternativaCorreta.id, acertou: false, aprovado: false, percentual: 0 }),
      });
      assert.equal(resposta.response.status, 200);
      if (i === 11) {
        assert.equal(resposta.data.concluida, true);
        assert.equal(resposta.data.resultado.acertos, 12);
        assert.equal(resposta.data.resultado.percentual, 100);
        assert.equal(resposta.data.resultado.aprovado, true);
      }
    }
    assert.equal(banco.respostas.length, 12);
    assert.equal(banco.resultados.length, 1);
  });

  it('interrompe questão aberta, persiste a resposta como interrompida e retoma no próximo tema', async () => {
    await cadastrarEAutenticar('10000000108');
    const inicio = await requisitar('/api/assessments/attempts', { method: 'POST' });
    const id = inicio.data.idTentativa;
    const primeira = await requisitar(`/api/assessments/attempts/${id}/current`);
    const idQuestaoInterrompida = primeira.data.questao.id;

    const pausa = await requisitar(`/api/assessments/attempts/${id}/interrupt`, { method: 'POST' });
    assert.equal(pausa.response.status, 200);
    assert.equal(pausa.data.pausada, true);
    assert.equal(pausa.data.questaoEncerrada, true);
    assert.equal(banco.respostas.at(-1).status_resposta, 'interrompida');
    assert.equal(banco.respostas.at(-1).acertou, false);

    const retomada = await requisitar('/api/assessments/attempts', { method: 'POST' });
    assert.equal(retomada.response.status, 200);
    assert.equal(retomada.data.retomada, true);
    const proxima = await requisitar(`/api/assessments/attempts/${id}/current`);
    assert.equal(proxima.response.status, 200);
    assert.notEqual(proxima.data.questao.id, idQuestaoInterrompida);
    assert.equal(proxima.data.numeroQuestao, 2); // questão interrompida é encerrada e a próxima questão avança

    // Simula fechamento/reload sem que o evento pagehide consiga chegar à API:
    // uma segunda solicitação da questão aberta encerra a anterior como interrompida.
    const aposReload = await requisitar(`/api/assessments/attempts/${id}/current`);
    assert.equal(aposReload.response.status, 200);
    assert.equal(aposReload.data.numeroQuestao, 3);
    assert.equal(banco.respostas.at(-1).status_resposta, 'interrompida');
  });

  it('encerra automaticamente questão após 150 segundos e informa o gabarito', async () => {
    await cadastrarEAutenticar('10000000280');
    const inicio = await requisitar('/api/assessments/attempts', { method: 'POST' });
    const id = inicio.data.idTentativa;
    await requisitar(`/api/assessments/attempts/${id}/current`);
    banco.elapsedSeconds = 150;
    const timeout = await requisitar(`/api/assessments/attempts/${id}/answers`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idAlternativa: null, acertou: true }),
    });
    assert.equal(timeout.response.status, 200);
    assert.equal(timeout.data.correto, false);
    assert.equal(timeout.data.alternativaCorreta, 'A');
    assert.equal(banco.respostas.at(-1).status_resposta, 'tempo_esgotado');
    assert.equal(banco.respostas.at(-1).acertou, false);
    banco.elapsedSeconds = 5;
  });

  it('não permite acessar avaliação sem autenticação', async () => {
    const resposta = await requisitar('/api/assessments/attempts', { method: 'POST' }, false);
    assert.equal(resposta.response.status, 401);
  });
});
