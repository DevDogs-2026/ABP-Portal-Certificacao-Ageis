const CURSO = { nome: "Metodologias Ágeis" };

const CHAVE_USUARIO_LOGADO = "usuarioLogado";
const CHAVE_USUARIOS = "usuarios";
const CHAVE_CERTIFICADOS = "certificados";

const CERTIFICADO_EXEMPLO = {
  codigo: "MA-7K2P-9XQ4",
  usuarioId: 0,
  nome: "Joaquim Ferreira Silva",
  cpf: "12345678900",
  email: "joaquim.silva@example.com",
  curso: CURSO.nome,
  horas: CURSO.horas,
  nota: 9.2,
  acertos: 92,
  emitidoEm: "2026-11-14T21:33:00.000Z",
};

function lerJSON(chave, padrao) {
  try {
    const valor = JSON.parse(localStorage.getItem(chave));
    return valor ?? padrao;
  } catch {
    return padrao;
  }
}

function lerUsuarioLogado() {
  const user = lerJSON(CHAVE_USUARIO_LOGADO, null);
  return user && user.id && user.nome ? user : null;
}

function lerDadosCadastro(id) {
  const lista = lerJSON(CHAVE_USUARIOS, []);
  return (Array.isArray(lista) && lista.find((u) => u.id === id)) || {};
}

function lerCertificados() {
  const lista = lerJSON(CHAVE_CERTIFICADOS, []);
  return Array.isArray(lista) ? lista : [];
}

function salvarCertificados(lista) {
  localStorage.setItem(CHAVE_CERTIFICADOS, JSON.stringify(lista));
}

function gerarCodigo() {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let letras = "";
  for (let i = 0; i < 8; i++) {
    letras += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  }
  return `MA-${letras.slice(0, 4)}-${letras.slice(4)}`;
}

function obterOuEmitirCertificado(user) {
  const lista = lerCertificados();
  const existente = lista.find(
    (c) => c.usuarioId === user.id && c.curso === CURSO.nome,
  );
  if (existente) return existente;

  const cadastro = lerDadosCadastro(user.id);
  const est = calcularEstatisticas(user.id);
  const novo = {
    codigo: gerarCodigo(),
    usuarioId: user.id,
    nome: user.nome,
    cpf: cadastro.cpf || "",
    email: cadastro.email || "",
    curso: CURSO.nome,

    nota: est.nota,
    acertos: est.percentual,
    emitidoEm: new Date().toISOString(),
  };
  lista.push(novo);
  salvarCertificados(lista);
  return novo;
}

function buscarCertificadoPorCodigo(codigo) {
  return (
    [CERTIFICADO_EXEMPLO, ...lerCertificados()].find(
      (c) => c.codigo === codigo,
    ) || null
  );
}

const $ = (id) => document.getElementById(id);

function formatarData(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatarDataHora(iso) {
  const d = new Date(iso);
  const data = d.toLocaleDateString("pt-BR");
  const hora = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${data} às ${hora}`;
}

function formatarCpf(cpf) {
  const n = String(cpf || "").replace(/\D/g, "");
  return n.length === 11 ? n : "—";
}

function formatarNota(nota) {
  return Number(nota).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function mostrarEstado(id) {
  ["estado-semlogin", "estado-perfil"].forEach((estado) => {
    $(estado).hidden = estado !== id;
  });
}

function normalizarCodigo(texto) {
  const limpo = texto.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const m = limpo.match(/^MA([A-Z0-9]{4})([A-Z0-9]{4})$/);
  return m ? `MA-${m[1]}-${m[2]}` : null;
}

const abas = [$("aba-meu"), $("aba-validar")];
const paineis = [$("painel-meu"), $("painel-validar")];

function selecionarAba(indice) {
  abas.forEach((aba, i) => {
    const ativa = i === indice;
    aba.setAttribute("aria-selected", String(ativa));
    aba.tabIndex = ativa ? 0 : -1;
    paineis[i].hidden = !ativa;
  });
}

abas.forEach((aba, i) => {
  aba.addEventListener("click", () => selecionarAba(i));
  aba.addEventListener("keydown", (e) => {
    let proxima = null;
    if (e.key === "ArrowRight") proxima = (i + 1) % abas.length;
    else if (e.key === "ArrowLeft")
      proxima = (i - 1 + abas.length) % abas.length;
    else if (e.key === "Home") proxima = 0;
    else if (e.key === "End") proxima = abas.length - 1;
    if (proxima === null) return;
    e.preventDefault();
    selecionarAba(proxima);
    abas[proxima].focus();
  });
});

const usuario = lerUsuarioLogado();
let certificado = null;
const estatisticas = usuario ? calcularEstatisticas(usuario.id) : null;
let progresso = estatisticas ? estatisticas.progresso : 0;

function mostrarProgresso(percentual) {
  let texto;
  if (estatisticas.aprovado) {
    texto = "Você foi aprovado na avaliação. Parabéns!";
  } else if (estatisticas.finalizada) {
    texto = `Você concluiu a avaliação com ${estatisticas.percentual}% de acertos. É preciso pelo menos ${MEDIA_APROVACAO}% para ser aprovado. Faça uma nova avaliação.`;
  } else {
    texto = `Você respondeu ${estatisticas.temasConcluidos} de ${estatisticas.totalTemas} temas da avaliação.`;
  }
  $("texto-progresso").textContent = texto;
  $("barra").setAttribute("aria-valuenow", String(percentual));
  $("barra").setAttribute("aria-valuetext", `${percentual}% concluído`);

  requestAnimationFrame(() => {
    $("barra-preenchida").style.width = `${percentual}%`;
  });
}

function linkDeValidacao(codigo) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("codigo", codigo);
  return url.toString();
}

function desenharQr(codigo) {
  const alvo = $("cert-qr");
  alvo.replaceChildren();

  if (typeof qrcode !== "function") {
    alvo.textContent = codigo;
    return;
  }

  const qr = qrcode(0, "M");
  qr.addData(linkDeValidacao(codigo));
  qr.make();
  alvo.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
}

function iniciais(nome) {
  const partes = String(nome || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!partes.length) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

function definirSubtitulo() {
  const primeiroNome = usuario.nome.split(" ")[0];
  $("subtitulo").textContent = estatisticas.aprovado
    ? `Parabéns, ${primeiroNome}! Seu certificado está pronto.`
    : `Olá, ${primeiroNome}! Acompanhe seu progresso na avaliação.`;
}

function mostrarPerfil(user, cadastro) {
  $("perfil-avatar").textContent = iniciais(user.nome);
  $("perfil-nome").textContent = user.nome;
  $("perfil-cpf").textContent = formatarCpf(cadastro.cpf || user.cpf);
  $("perfil-email").textContent = cadastro.email || user.email || "—";
  $("perfil-curso").textContent = CURSO.nome;
}

function mostrarCertificado(cert) {
  $("cert-nome").textContent = cert.nome;
  $("cert-curso").textContent = cert.curso;
  $("cert-cpf").textContent = formatarCpf(cert.cpf);
  $("cert-email").textContent = cert.email || "—";
  $("cert-nota").textContent = formatarNota(cert.nota);
  $("cert-acertos").textContent = `${cert.acertos}%`;
  $("cert-data").textContent = `[${formatarDataHora(cert.emitidoEm)}]`;
  $("cert-codigo").textContent = cert.codigo;
  desenharQr(cert.codigo);
}

function criar(tag, texto, classe) {
  const el = document.createElement(tag);
  el.textContent = texto;
  if (classe) el.className = classe;
  return el;
}

function renderizarTemas() {
  const lista = $("lista-temas");
  lista.replaceChildren();

  const resumo = resumoPorTema(usuario.id);
  resumo.forEach((r) => {
    const li = document.createElement("li");
    li.className = `tema-item${r.concluido ? " tema-concluido" : ""}`;

    const status = r.concluido
      ? "Concluído"
      : r.respondidas > 0
        ? "Em andamento"
        : "Não iniciado";

    li.append(
      criar("strong", r.tema.nome),
      criar(
        "span",
        `${r.respondidas}/${r.total} questões · ${r.acertos} acertos`,
        "tema-info",
      ),
      criar("span", status, "tema-badge"),
    );
    lista.appendChild(li);
  });

  const concluidos = resumo.filter((r) => r.concluido).length;
  $("texto-temas").textContent =
    `${concluidos} de ${resumo.length} temas concluídos.`;
}

function prepararFiltro() {
  const select = $("filtro-tema");
  select.replaceChildren(new Option("Todos os temas", ""));
  TEMAS.forEach((t) => select.add(new Option(t.nome, t.id)));
  select.addEventListener("change", () => renderizarHistorico(select.value));
}

function renderizarHistorico(temaId = "") {
  const lista = $("lista-historico");
  lista.replaceChildren();

  const itens = historicoDoUsuario(usuario.id).filter(
    (h) => !temaId || h.temaId === temaId,
  );

  if (!itens.length) {
    lista.appendChild(
      criar("li", "Nenhuma resposta registrada ainda.", "texto-suave"),
    );
    return;
  }

  itens.forEach((h) => {
    const li = document.createElement("li");
    li.className = `historico-item ${h.acertou ? "resposta-ok" : "resposta-erro"}`;

    const topo = document.createElement("div");
    topo.className = "historico-topo";
    topo.append(
      criar("strong", h.temaNome),
      criar("span", h.acertou ? "Acertou" : "Errou", "tema-badge"),
    );

    const detalhes = [`Sua resposta: ${h.respostaDada || "—"}`];
    if (!h.acertou) detalhes.push(`Correta: ${h.respostaCorreta}`);
    detalhes.push(`Tentativa ${h.tentativa}`);
    detalhes.push(formatarDataHora(h.respondidoEm));

    li.append(
      topo,
      criar("p", h.enunciado, "historico-enunciado"),
      criar("small", detalhes.join(" · "), "dica"),
    );
    lista.appendChild(li);
  });
}

if (!usuario) {
  $("subtitulo").textContent = "Entre na sua conta para acessar seu perfil.";
  mostrarEstado("estado-semlogin");
} else {
  const cadastro = lerDadosCadastro(usuario.id);

  mostrarPerfil(usuario, cadastro);
  mostrarProgresso(progresso);
  prepararFiltro();
  renderizarTemas();
  renderizarHistorico();

  if (!estatisticas.aprovado) {
    definirSubtitulo();
    $("cert-bloqueado").hidden = false;
    $("estado-liberado").hidden = true;
    $("btn-continuar").hidden = false;
  } else {
    definirSubtitulo();
    certificado = obterOuEmitirCertificado(usuario);
    mostrarCertificado(certificado);
    $("cert-bloqueado").hidden = true;
    $("estado-liberado").hidden = false;
    $("btn-continuar").hidden = true;
  }
  mostrarEstado("estado-perfil");
}

$("btn-baixar").addEventListener("click", () => {
  if (!certificado) return;
  const tituloOriginal = document.title;
  document.title = `Certificado - ${certificado.nome}`;
  window.print();
  document.title = tituloOriginal;
});

$("btn-copiar").addEventListener("click", async (e) => {
  if (!certificado) return;
  const botao = e.currentTarget;
  const textoOriginal = botao.textContent;
  try {
    await navigator.clipboard.writeText(certificado.codigo);
    botao.textContent = "Código copiado!";
  } catch {
    botao.textContent = "Não foi possível copiar";
  }
  setTimeout(() => {
    botao.textContent = textoOriginal;
  }, 2000);
});

const perfilForm = $("perfil-form");
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let timerStatus = null;

function abrirEdicao() {
  const cadastro = lerDadosCadastro(usuario.id);
  $("edit-nome").value = usuario.nome;
  $("edit-email").value = cadastro.email || usuario.email || "";
  $("perfil-erro").textContent = "";
  $("perfil-status").textContent = "";
  perfilForm.hidden = false;
  document.querySelector(".dados").hidden = true;
  $("btn-editar").hidden = true;
  $("edit-nome").focus();
}

function fecharEdicao() {
  perfilForm.hidden = true;
  document.querySelector(".dados").hidden = false;
  $("btn-editar").hidden = false;
  $("btn-editar").focus();
}

function salvarDadosUsuario(nome, email) {
  const logado = lerJSON(CHAVE_USUARIO_LOGADO, {});
  localStorage.setItem(
    CHAVE_USUARIO_LOGADO,
    JSON.stringify({ ...logado, nome, email }),
  );

  const usuarios = lerJSON(CHAVE_USUARIOS, []);
  if (Array.isArray(usuarios)) {
    const i = usuarios.findIndex((u) => u.id === usuario.id);
    if (i >= 0) {
      usuarios[i] = { ...usuarios[i], nome, email };
      localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
    }
  }

  const certificados = lerCertificados();
  certificados.forEach((c) => {
    if (c.usuarioId === usuario.id) {
      c.nome = nome;
      c.email = email;
    }
  });
  salvarCertificados(certificados);
}

$("btn-editar").addEventListener("click", abrirEdicao);
$("btn-cancelar").addEventListener("click", fecharEdicao);

perfilForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!usuario) return;

  const nome = $("edit-nome").value.trim().replace(/\s+/g, " ");
  const email = $("edit-email").value.trim().toLowerCase();
  const erro = $("perfil-erro");

  if (nome.length < 3) {
    erro.textContent = "Informe seu nome completo.";
    $("edit-nome").focus();
    return;
  }
  if (!EMAIL_VALIDO.test(email)) {
    erro.textContent = "Informe um e-mail válido.";
    $("edit-email").focus();
    return;
  }
  const lista = lerJSON(CHAVE_USUARIOS, []);
  const emEuso =
    Array.isArray(lista) &&
    lista.some(
      (u) =>
        u.id !== usuario.id && String(u.email || "").toLowerCase() === email,
    );
  if (emEuso) {
    erro.textContent = "Este e-mail já está em uso por outra conta.";
    $("edit-email").focus();
    return;
  }

  salvarDadosUsuario(nome, email);
  usuario.nome = nome;
  usuario.email = email;

  mostrarPerfil(usuario, lerDadosCadastro(usuario.id));
  definirSubtitulo();
  if (certificado) {
    certificado = obterOuEmitirCertificado(usuario);
    mostrarCertificado(certificado);
  }

  fecharEdicao();
  $("perfil-status").textContent = "Dados atualizados com sucesso.";
  clearTimeout(timerStatus);
  timerStatus = setTimeout(() => {
    $("perfil-status").textContent = "";
  }, 4000);
});

const validarForm = $("validarForm");
const resultado = $("resultado");

function mostrarResultado(tipo, titulo, linhas = []) {
  resultado.replaceChildren();

  const card = document.createElement("div");
  card.className = `resultado-card resultado-${tipo}`;

  const strong = document.createElement("strong");
  strong.textContent = titulo;
  card.appendChild(strong);

  linhas.forEach((linha) => {
    const span = document.createElement("span");
    span.textContent = linha;
    card.appendChild(span);
  });

  resultado.appendChild(card);
}

validarForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const digitado = validarForm.codigo.value.trim();

  if (!digitado) {
    mostrarResultado("erro", "Digite o código do certificado.", [
      "Ele aparece abaixo do certificado.",
    ]);
    validarForm.codigo.focus();
    return;
  }

  const codigo = normalizarCodigo(digitado);

  if (!codigo) {
    mostrarResultado("erro", "Formato de código inválido.", [
      "Use o formato MA-XXXX-XXXX.",
    ]);
    validarForm.codigo.focus();
    return;
  }

  validarForm.codigo.value = codigo;
  const cert = buscarCertificadoPorCodigo(codigo);

  if (!cert) {
    mostrarResultado("erro", "Código não encontrado.", [
      "Confira se digitou todos os caracteres e tente de novo.",
    ]);
    return;
  }

  mostrarResultado("ok", "Certificado válido.", [
    `Aluno: ${cert.nome}`,
    `Curso: ${cert.curso} `,
    `Emitido em ${formatarData(cert.emitidoEm)}`,
  ]);
});

const codigoDaUrl = new URLSearchParams(window.location.search).get("codigo");
if (codigoDaUrl) {
  selecionarAba(1);
  validarForm.codigo.value = codigoDaUrl;
  validarForm.requestSubmit();
}

window.addEventListener("storage", (e) => {
  if (e.key === CHAVE_HISTORICO) location.reload();
});
