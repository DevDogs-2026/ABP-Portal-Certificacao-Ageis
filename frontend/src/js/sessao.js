// Consulta a sessão no servidor e valida a estrutura do usuário autenticado.
async function consultarUsuarioLogado() {
  const { response, data } = await window.apiAuth('/me');

  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error(data.mensagem || 'Não foi possível verificar a sessão.');
  }
  if (!data.usuario || typeof data.usuario.nome !== 'string') {
    throw new Error('A resposta da sessão não contém um usuário válido.');
  }

  return data.usuario;
}

// Encerra a sessão no servidor antes de voltar à página inicial.
async function sair() {
  try {
    const { response, data } = await window.apiAuth('/logout', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(data.mensagem || 'Não foi possível encerrar a sessão.');
    }

    window.location.href = 'index.html';
  } catch (error) {
    console.error('Erro ao encerrar a sessão:', error);
    alert('Não foi possível sair da conta. Tente novamente.');
  }
}

// Confere a sessão de uma página privada e guarda o destino do redirecionamento.
async function exigirLogin() {
  try {
    const usuario = await consultarUsuarioLogado();
    if (usuario) return usuario;

    const pagina = window.location.pathname.split('/').pop();
    if (pagina) sessionStorage.setItem('voltarPara', pagina);
    window.location.replace('acesso.html');
    return null;
  } catch (error) {
    console.error('Erro ao verificar a sessão:', error);
    alert('Não foi possível verificar sua sessão. Tente novamente.');
    window.location.replace('acesso.html');
    return null;
  }
}

// Exibe o nome do candidato e a ação de sair quando existe uma sessão ativa.
async function atualizarHeader() {
  const area = document.querySelector('.login-container');
  if (!area) return;

  try {
    const usuario = await consultarUsuarioLogado();
    if (!usuario) return;

    const nome = document.createElement('span');
    nome.className = 'usuario-nome';
    nome.textContent = `Olá, ${usuario.nome.trim().split(/\s+/)[0]}`;

    const botaoSair = document.createElement('button');
    botaoSair.className = 'btnLogin-popup';
    botaoSair.textContent = 'Sair';
    botaoSair.addEventListener('click', sair);

    area.replaceChildren(nome, botaoSair);
  } catch (error) {
    console.error('Erro ao carregar a sessão no cabeçalho:', error);
  }
}

atualizarHeader();
