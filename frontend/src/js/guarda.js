// Protege páginas privadas consultando a sessão real do backend.
(function () {
  const PAGINA_LOGIN = 'acesso.html';
  // Remove chaves sensíveis gravadas por versões antigas do projeto.
  for (const chave of ['usuarios', 'usuarioLogado', 'tentativasLogin']) {
    try { localStorage.removeItem(chave); } catch {}
  }
  // Código de certificado pode ser validado publicamente sem login.
  if (location.pathname.endsWith('/perfil.html') && new URLSearchParams(location.search).has('codigo')) return;
  document.documentElement.style.visibility = 'hidden';

  async function verificar() {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.usuario?.id) {
          document.documentElement.style.visibility = 'visible';
          return;
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    }

    const pagina = location.pathname.split('/').pop() || 'avaliacao.html';
    sessionStorage.setItem('voltarPara', pagina + location.search);
    location.replace(PAGINA_LOGIN);
  }

  verificar();
})();
