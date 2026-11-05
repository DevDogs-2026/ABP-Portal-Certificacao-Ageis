(async function () {
  document.documentElement.style.visibility = 'hidden';

  try {
    const { response } = await window.apiAuth('/me');

    if (response.status === 401) {
      const pagina = window.location.pathname.split('/').pop() || 'avaliacao.html';
      sessionStorage.setItem('voltarPara', pagina);
      window.location.replace('acesso.html');
      return;
    }

    if (!response.ok) {
      throw new Error('O servidor não conseguiu verificar sua sessão.');
    }

    document.documentElement.style.visibility = 'visible';
  } catch (error) {
    console.error('Erro ao verificar a sessão da página:', error);
    alert('Não foi possível verificar sua sessão. Entre novamente.');
    window.location.replace('acesso.html');
  }
})();
