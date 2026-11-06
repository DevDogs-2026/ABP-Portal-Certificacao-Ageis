// Faz uma chamada à API com o cookie de sessão e devolve status e corpo da resposta.
window.apiRequest = async function (rota, opcoes = {}) {
  const response = await fetch(`http://127.0.0.1:3000/api${rota}`, {
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
