// Perfil integrado ao PostgreSQL: não usa o histórico do localStorage como fonte de verdade.
const CURSO = { nome: 'Metodologias Ágeis' };
const MEDIA_APROVACAO = 65;
const $ = (id) => document.getElementById(id);

let usuario = null;
let certificado = null;
let tentativas = [];
let temas = [];
let respostas = [];
let timerStatus = null;

function mostrarEstado(id) {
  ['estado-semlogin', 'estado-perfil'].forEach(estado => {
    $(estado).hidden = estado !== id;
  });
}

function criar(tag, texto, classe = '') {
  const elemento = document.createElement(tag);
  elemento.textContent = String(texto ?? '');
  if (classe) elemento.className = classe;
  return elemento;
}

function formatarCpf(cpf) {
  const digits = String(cpf || '').replace(/\D/g, '');
  return digits.length === 11 ? digits : '—';
}
function formatarDataHora(valor) {
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? '—'
    : d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
function formatarData(valor) {
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
}
function formatarNumero(valor, casas = 2) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: casas, maximumFractionDigits: casas,
  });
}
function iniciais(nome) {
  const palavras = String(nome || '').trim().split(/\s+/).filter(Boolean);
  return (palavras[0]?.[0] || '?').toUpperCase()
    + (palavras.length > 1 ? palavras[palavras.length - 1][0].toUpperCase() : '');
}
function erroDaApi(data, alternativa) {
  return data?.mensagem || alternativa;
}
async function consultar(rota, opcoes = {}) {
  const { response, data } = await window.apiRequest(rota, opcoes);
  if (!response.ok) throw new Error(erroDaApi(data, 'Não foi possível consultar o servidor.'));
  return data;
}

const abas = [$('aba-meu'), $('aba-validar')];
const paineis = [$('painel-meu'), $('painel-validar')];
function selecionarAba(indice) {
  abas.forEach((aba, i) => {
    const ativa = i === indice;
    aba.setAttribute('aria-selected', String(ativa));
    aba.tabIndex = ativa ? 0 : -1;
    paineis[i].hidden = !ativa;
  });
}
abas.forEach((aba, i) => {
  aba.addEventListener('click', () => selecionarAba(i));
  aba.addEventListener('keydown', (evento) => {
    const prox = evento.key === 'ArrowRight' ? (i + 1) % abas.length
      : evento.key === 'ArrowLeft' ? (i - 1 + abas.length) % abas.length
      : evento.key === 'Home' ? 0
      : evento.key === 'End' ? abas.length - 1 : null;
    if (prox === null) return;
    evento.preventDefault();
    selecionarAba(prox);
    abas[prox].focus();
  });
});

function mostrarPerfil() {
  $('perfil-avatar').textContent = iniciais(usuario.nome);
  $('perfil-nome').textContent = usuario.nome;
  $('perfil-cpf').textContent = formatarCpf(usuario.cpf);
  $('perfil-email').textContent = usuario.email || '—';
  $('perfil-curso').textContent = CURSO.nome;
  const primeiro = usuario.nome.trim().split(/\s+/)[0];
  $('subtitulo').textContent = `Olá, ${primeiro}! Acompanhe seu progresso na avaliação.`;
}

function mostrarProgresso() {
  const ultima = tentativas[0] || null;
  const total = ultima?.totalQuestoes || temas.length || 12;
  const respondidas = ultima?.respondidas || 0;
  const percentual = Math.min(100, Math.round(100 * respondidas / total));
  let mensagem;
  if (!ultima) mensagem = `Você respondeu 0 de ${total} temas da avaliação.`;
  else if (ultima.status === 'concluida') {
    mensagem = `Você concluiu a avaliação com ${formatarNumero(ultima.percentual)}% de acertos (${ultima.acertos} de ${total}). `
      + (ultima.aprovado ? 'Aprovado!' : `É preciso pelo menos ${MEDIA_APROVACAO}% para ser aprovado.`);
  } else mensagem = `Você respondeu ${respondidas} de ${total} temas da avaliação.`;
  $('texto-progresso').textContent = mensagem;
  $('barra').setAttribute('aria-valuenow', String(percentual));
  $('barra').setAttribute('aria-valuetext', `${percentual}% concluído`);
  $('barra-preenchida').style.width = `${percentual}%`;
  $('btn-continuar').hidden = Boolean(ultima?.aprovado);
  if (ultima?.aprovado) {
    $('subtitulo').textContent = `Parabéns, ${usuario.nome.split(' ')[0]}! Seu certificado está pronto.`;
  }
}

function mostrarTemas() {
  const lista = $('lista-temas');
  lista.replaceChildren();
  const ultimaId = tentativas[0]?.id;
  const recentes = respostas.filter(r => r.tentativaId === ultimaId);
  let concluidos = 0;
  temas.forEach(tema => {
    const desteTema = recentes.filter(r => r.temaId === tema.id);
    const acertos = desteTema.filter(r => r.acertou).length;
    if (desteTema.length) concluidos++;
    const li = document.createElement('li');
    li.className = `tema-item${desteTema.length ? ' tema-concluido' : ''}`;
    li.append(
      criar('strong', tema.nome),
      criar('span', `${desteTema.length}/1 questões · ${acertos} acertos`, 'tema-info'),
      criar('span', desteTema.length ? 'Concluído' : 'Não iniciado', 'tema-badge'),
    );
    lista.appendChild(li);
  });
  $('texto-temas').textContent = `${concluidos} de ${temas.length} temas concluídos na última tentativa.`;
}

function mostrarHistorico(temaId = '') {
  const lista = $('lista-historico');
  lista.replaceChildren();
  const itens = respostas.filter(r => !temaId || String(r.temaId) === String(temaId));
  if (!itens.length) {
    lista.appendChild(criar('li', 'Nenhuma resposta registrada ainda.', 'texto-suave'));
    return;
  }
  itens.forEach(r => {
    const li = document.createElement('li');
    li.className = `historico-item ${r.acertou ? 'resposta-ok' : 'resposta-erro'}`;
    const topo = document.createElement('div');
    topo.className = 'historico-topo';
    topo.append(criar('strong', r.temaNome), criar('span', r.acertou ? 'Acertou' : 'Errou', 'tema-badge'));
    const detalhes = [`Sua resposta: ${r.respostaDada || 'Tempo esgotado'}`];
    if (!r.acertou) detalhes.push(`Correta: ${r.respostaCorreta || '—'}`);
    detalhes.push(`Tentativa ${r.tentativaId}`, formatarDataHora(r.respondidoEm));
    li.append(topo, criar('p', r.enunciado, 'historico-enunciado'), criar('small', detalhes.join(' · '), 'dica'));
    lista.appendChild(li);
  });
}

function preencherFiltro() {
  const filtro = $('filtro-tema');
  filtro.replaceChildren(new Option('Todos os temas', ''));
  temas.forEach(t => filtro.add(new Option(t.nome, String(t.id))));
  filtro.addEventListener('change', () => mostrarHistorico(filtro.value));
}

function linkValidacao(codigo) {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('codigo', codigo);
  return url.toString();
}
function desenharQr(codigo) {
  const alvo = $('cert-qr');
  alvo.replaceChildren();
  if (typeof qrcode !== 'function') {
    alvo.textContent = codigo;
    return;
  }
  const qr = qrcode(0, 'M');
  qr.addData(linkValidacao(codigo));
  qr.make();
  alvo.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
}
function mostrarCertificado(cert) {
  $('cert-nome').textContent = cert.nome;
  $('cert-curso').textContent = cert.curso;
  $('cert-cpf').textContent = formatarCpf(usuario.cpf);
  $('cert-email').textContent = usuario.email || '—';
  $('cert-nota').textContent = formatarNumero(cert.nota, 1);
  $('cert-acertos').textContent = `${formatarNumero(cert.acertos)}%`;
  $('cert-data').textContent = formatarDataHora(cert.emitidoEm);
  $('cert-codigo').textContent = cert.codigo;
  desenharQr(cert.codigo);
}
async function carregarCertificado() {
  try {
    const dados = await consultar('/certificates/me');
    certificado = dados.certificado || null;
    $('cert-bloqueado').hidden = Boolean(certificado);
    $('estado-liberado').hidden = !certificado;
    if (certificado) mostrarCertificado(certificado);
  } catch (error) {
    console.error('Falha ao consultar certificado:', error);
    $('cert-bloqueado').hidden = false;
    $('cert-bloqueado').textContent = 'Não foi possível consultar o certificado. Atualize a página para tentar novamente.';
    $('estado-liberado').hidden = true;
  }
}

$('btn-baixar').addEventListener('click', () => {
  if (!certificado) return;
  const original = document.title;
  document.title = `Certificado - ${certificado.nome}`;
  window.print();
  document.title = original;
});
$('btn-copiar').addEventListener('click', async (evento) => {
  if (!certificado) return;
  const botao = evento.currentTarget;
  const original = botao.textContent;
  try {
    await navigator.clipboard.writeText(certificado.codigo);
    botao.textContent = 'Código copiado!';
  } catch {
    botao.textContent = 'Não foi possível copiar';
  }
  setTimeout(() => { botao.textContent = original; }, 2000);
});

function fecharEdicao() {
  $('perfil-form').hidden = true;
  document.querySelector('.dados').hidden = false;
  $('btn-editar').hidden = false;
  $('btn-editar').focus();
}
$('btn-editar').addEventListener('click', () => {
  if (!usuario) return;
  $('edit-nome').value = usuario.nome;
  $('edit-email').value = usuario.email || '';
  $('perfil-erro').textContent = '';
  $('perfil-status').textContent = '';
  $('perfil-form').hidden = false;
  document.querySelector('.dados').hidden = true;
  $('btn-editar').hidden = true;
  $('edit-nome').focus();
});
$('btn-cancelar').addEventListener('click', fecharEdicao);
$('perfil-form').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  if (!usuario) return;
  const nome = $('edit-nome').value.trim().replace(/\s+/g, ' ');
  const email = $('edit-email').value.trim().toLowerCase();
  if (nome.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    $('perfil-erro').textContent = 'Informe nome e e-mail válidos.';
    return;
  }
  const botao = $('perfil-form').querySelector('button[type="submit"]');
  botao.disabled = true;
  try {
    const dados = await consultar('/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email }),
    });
    usuario = dados.usuario;
    mostrarPerfil();
    if (certificado) {
      certificado.nome = usuario.nome;
      mostrarCertificado(certificado);
    }
    fecharEdicao();
    $('perfil-status').textContent = 'Seu perfil foi atualizado com sucesso.';
    clearTimeout(timerStatus);
    timerStatus = setTimeout(() => { $('perfil-status').textContent = ''; }, 4500);
  } catch (error) {
    $('perfil-erro').textContent = error.message;
  } finally {
    botao.disabled = false;
  }
});

function normalizarCodigo(valor) {
  const limpo = String(valor || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!/^MA[A-F0-9]{32}$/.test(limpo)) return null;
  return `MA-${limpo.slice(2).match(/.{8}/g).join('-')}`;
}
function mostrarValidacao(tipo, titulo, linhas = []) {
  const resultado = $('resultado');
  resultado.replaceChildren();
  const card = document.createElement('div');
  card.className = `resultado-card resultado-${tipo}`;
  card.appendChild(criar('strong', titulo));
  linhas.forEach(linha => card.appendChild(criar('span', linha)));
  resultado.appendChild(card);
}
$('validarForm').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const campo = $('codigo');
  const codigo = normalizarCodigo(campo.value);
  if (!codigo) {
    mostrarValidacao('erro', 'Código inválido.', ['Informe o código completo do certificado.']);
    return;
  }
  campo.value = codigo;
  try {
    const dados = await consultar(`/certificates/verify?codigo=${encodeURIComponent(codigo)}`);
    const c = dados.certificado;
    mostrarValidacao('ok', 'Certificado válido.', [
      `Aluno: ${c.nome}`, `Curso: ${c.curso}`, `Emitido em ${formatarData(c.emitidoEm)}`,
    ]);
  } catch (error) {
    mostrarValidacao('erro', error.message);
  }
});

async function iniciarPerfil() {
  const codigoUrl = new URLSearchParams(window.location.search).get('codigo');
  try {
    const dados = await consultar('/auth/profile');
    usuario = dados.usuario;
    mostrarPerfil();
    mostrarEstado('estado-perfil');
    $('texto-progresso').textContent = 'Carregando dados do PostgreSQL...';
    $('lista-historico').replaceChildren(criar('li', 'Carregando histórico...', 'texto-suave'));
    try {
      const [avaliacoes, historico] = await Promise.all([
        consultar('/assessments/attempts'),
        consultar('/assessments/history'),
      ]);
      tentativas = avaliacoes.tentativas || [];
      temas = historico.temas || [];
      respostas = historico.respostas || [];
      mostrarProgresso();
      mostrarTemas();
      preencherFiltro();
      mostrarHistorico();
    } catch (error) {
      console.error('Falha ao carregar progresso:', error);
      $('texto-progresso').textContent = `Erro ao carregar o progresso: ${error.message}`;
      $('texto-temas').textContent = 'Não foi possível consultar os temas.';
      $('lista-historico').replaceChildren(criar('li', 'Não foi possível consultar as respostas.', 'texto-suave'));
    }
    await carregarCertificado();
  } catch (error) {
    if (error.message === 'Não autorizado') {
      mostrarEstado('estado-semlogin');
      $('subtitulo').textContent = 'Entre na sua conta para acessar seu perfil.';
    } else {
      mostrarEstado('estado-semlogin');
      $('subtitulo').textContent = `Não foi possível verificar sua conta: ${error.message}`;
    }
  }
  if (codigoUrl) {
    selecionarAba(1);
    $('codigo').value = codigoUrl;
    $('validarForm').requestSubmit();
  }
}
iniciarPerfil();