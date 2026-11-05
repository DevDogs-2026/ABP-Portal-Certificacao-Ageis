const CURSO = { nome: "Metodologias Ágeis" };

const progresso = 100;
const NOTA_FINAL = 9.2;
const PERCENTUAL_ACERTOS = 92;

const CHAVE_USUARIO_LOGADO = "usuarioLogado";
const CHAVE_USUARIOS = "usuarios";
const CHAVE_CERTIFICADOS = "certificados";

const CERTIFICADO_EXEMPLO = {
  codigo: "MA-7K2P-9XQ4",
  usuarioId: 0,
  nome: "Joaquim Ferreira Silva",
  cpf: "51138269318",
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
  const novo = {
    codigo: gerarCodigo(),
    usuarioId: user.id,
    nome: user.nome,
    cpf: cadastro.cpf || "",
    email: cadastro.email || "",
    curso: CURSO.nome,

    nota: NOTA_FINAL,
    acertos: PERCENTUAL_ACERTOS,
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
  return n.length === 11
    ? `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`
    : "—";
}

function formatarNota(nota) {
  return Number(nota).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function mostrarEstado(id) {
  ["estado-semlogin", "estado-bloqueado", "estado-liberado"].forEach(
    (estado) => {
      $(estado).hidden = estado !== id;
    },
  );
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

function mostrarProgresso(percentual) {
  $("texto-progresso").textContent =
    `Você concluiu ${percentual}% do curso. O certificado é liberado ao chegar em 100%.`;
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

if (!usuario) {
  $("subtitulo").textContent = "Entre na sua conta para acessar o certificado.";
  mostrarEstado("estado-semlogin");
} else {
  const primeiroNome = usuario.nome.split(" ")[0];

  if (progresso < 100) {
    $("subtitulo").textContent =
      `Olá, ${primeiroNome}! Falta pouco para concluir o curso.`;
    mostrarProgresso(progresso);
    mostrarEstado("estado-bloqueado");
  } else {
    $("subtitulo").textContent =
      `Parabéns, ${primeiroNome}! Seu certificado está pronto.`;
    certificado = obterOuEmitirCertificado(usuario);
    mostrarCertificado(certificado);
    mostrarEstado("estado-liberado");
  }
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
