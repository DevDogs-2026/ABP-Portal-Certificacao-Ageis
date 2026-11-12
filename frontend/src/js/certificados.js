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
  const codigo = limpo.match(/^MA([A-F0-9]{32})$/);
  if (!codigo) return null;
  return `MA-${codigo[1].match(/.{8}/g).join("-")}`;
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

let certificado = null;

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
  $("cert-nota").textContent = formatarNota(cert.nota);
  $("cert-acertos").textContent = `${cert.acertos}%`;
  $("cert-data").textContent = `[${formatarDataHora(cert.emitidoEm)}]`;
  $("cert-codigo").textContent = cert.codigo;
  desenharQr(cert.codigo);
}

async function carregarCertificado() {
  try {
    const sessao = await window.apiAuth("/me");
    if (sessao.response.status === 401) {
      $("subtitulo").textContent = "Entre na sua conta para acessar o certificado.";
      mostrarEstado("estado-semlogin");
      return;
    }
    if (!sessao.response.ok || typeof sessao.data.usuario?.nome !== "string") {
      throw new Error(sessao.data.mensagem || "Não foi possível verificar a sessão.");
    }

    const resposta = await window.apiRequest("/certificates/me");
    if (!resposta.response.ok) {
      throw new Error(resposta.data.mensagem || "Não foi possível carregar o certificado.");
    }

    certificado = resposta.data.certificado;
    if (!certificado) {
      $("subtitulo").textContent = "Conclua uma avaliação para consultar seu certificado.";
      mostrarEstado("estado-bloqueado");
      return;
    }

    $("subtitulo").textContent =
      `Parabéns, ${sessao.data.usuario.nome.trim().split(/\s+/)[0]}! Seu certificado está pronto.`;
    mostrarCertificado(certificado);
    mostrarEstado("estado-liberado");
  } catch (error) {
    console.error("Erro ao carregar o certificado:", error);
    $("subtitulo").textContent = "Não foi possível carregar seu certificado.";
    $("texto-progresso").textContent = "Tente novamente mais tarde.";
    mostrarEstado("estado-bloqueado");
  }
}

carregarCertificado();

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

validarForm.addEventListener("submit", async (e) => {
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
  try {
    const resposta = await window.apiRequest(
      `/certificates/verify?codigo=${encodeURIComponent(codigo)}`,
    );
    if (resposta.response.status === 404) {
      mostrarResultado("erro", "Código não encontrado.", [
        "Confira se digitou todos os caracteres e tente de novo.",
      ]);
      return;
    }
    if (!resposta.response.ok || !resposta.data.certificado) {
      throw new Error(resposta.data.mensagem || "Não foi possível validar o certificado.");
    }

    const cert = resposta.data.certificado;
    mostrarResultado("ok", "Certificado válido.", [
      `Aluno: ${cert.nome}`,
      `Curso: ${cert.curso}`,
      `Emitido em ${formatarData(cert.emitidoEm)}`,
    ]);
  } catch (error) {
    console.error("Erro ao validar o certificado:", error);
    mostrarResultado("erro", "Não foi possível validar o certificado.", [
      "Tente novamente mais tarde.",
    ]);
  }
});

const codigoDaUrl = new URLSearchParams(window.location.search).get("codigo");
if (codigoDaUrl) {
  selecionarAba(1);
  validarForm.codigo.value = codigoDaUrl;
  validarForm.requestSubmit();
}
