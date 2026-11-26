// Sessão do DogSchool: consultar SEMPRE o backend (cookie HttpOnly).
// Limpa chaves persistidas por versões antigas, inclusive CPFs e dados de cadastro.
function limparDadosLocaisLegados() {
  for (const chave of ['usuarios', 'usuarioLogado', 'tentativasLogin']) {
    try { localStorage.removeItem(chave); } catch {}
  }
}

limparDadosLocaisLegados();

// O cache existe apenas na memória da aba; é perdido ao fechar/recarregar a página.
let usuarioEmMemoria = null;

function usuarioLogado() {
  return usuarioEmMemoria;
}

async function consultarSessao() {
  const response = await fetch('/api/auth/me', {
    credentials: 'include',
    cache: 'no-store',
  });
  if (!response.ok) {
    usuarioEmMemoria = null;
    return null;
  }
  const data = await response.json();
  usuarioEmMemoria = data.usuario || null;
  return usuarioEmMemoria;
}

async function sair() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Falha ao encerrar sessão.');
    usuarioEmMemoria = null;
    limparDadosLocaisLegados();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Erro no logout:', error);
    alert('Não foi possível sair. Verifique a conexão e tente novamente.');
  }
}

async function exigirLogin() {
  try {
    const usuario = await consultarSessao();
    if (usuario) return usuario;
  } catch (error) {
    console.error('Erro ao consultar sessão:', error);
  }
  usuarioEmMemoria = null;
  window.location.href = 'acesso.html';
  return null;
}

async function atualizarHeader() {
  const area = document.querySelector('.login-container');
  if (!area) return;

  try {
    const usuario = await consultarSessao();
    if (!usuario) return; // Mantém o botão de login do HTML.

    // Na página inicial, leva quem já está logado diretamente aos estudos.
    const botaoPrincipal = document.querySelector('.btn-inscricao');
    if (botaoPrincipal) {
      botaoPrincipal.href = 'estudos.html';
      const textoPrincipal = botaoPrincipal.querySelector('.btn-inscricao-texto');
      if (textoPrincipal) textoPrincipal.textContent = 'Comece a estudar';
    }

    const botaoSair = document.createElement('button');
    botaoSair.className = 'btnLogin-popup';
    botaoSair.textContent = 'Sair';
    botaoSair.addEventListener('click', sair);
    area.replaceChildren(botaoSair);
  } catch (error) {
    usuarioEmMemoria = null;
    console.error('Erro ao atualizar sessão no cabeçalho:', error);
  }
}

// Limpa somente dados legados do navegador; não altera cadastros do PostgreSQL.
function limparDadosDeTeste(_email) {
  limparDadosLocaisLegados();
  window.location.reload();
}

atualizarHeader();
