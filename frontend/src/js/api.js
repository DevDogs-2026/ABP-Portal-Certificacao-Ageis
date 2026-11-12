// Faz uma chamada à API com o cookie de sessão e devolve status e corpo da resposta.
const apiBase = window.location.port === '5500'
  ? 'http://127.0.0.1:3000/api'
  : `${window.location.origin}/api`;

window.apiRequest = async function (rota, opcoes = {}) {
  const response = await fetch(`${apiBase}${rota}`, {
    ...opcoes,
    credentials: 'include',
    headers: {
      ...(opcoes.headers || {}),
    },
    cache: 'no-store',
  });

  const corpo = await response.text();
  let data = {};

  if (corpo) {
    try {
      data = JSON.parse(corpo);
    } catch {
      data = { mensagem: corpo };
    }
  }

  return { response, data };
};

// Encaminha chamadas de autenticação pelo helper compartilhado da API.
window.apiAuth = function (rota, opcoes = {}) {
  return window.apiRequest(`/auth${rota}`, opcoes);
};
