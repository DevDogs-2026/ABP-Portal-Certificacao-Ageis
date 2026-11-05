window.apiAuth = async function (rota, opcoes = {}) {
  const response = await fetch(`http://127.0.0.1:3000/api/auth${rota}`, {
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
