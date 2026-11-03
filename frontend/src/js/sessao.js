// ---------- Sessão (só para testes: usa o localStorage) ----------
const CHAVE_SESSAO = 'usuarioLogado';

function usuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_SESSAO));
  } catch {
    return null;
  }
}

function sair() {
  localStorage.removeItem(CHAVE_SESSAO);
  window.location.href = 'index.html';
}

// Usar nas páginas que exigem login (avaliacao, certificados) que vai ser implementado futuramente
function exigirLogin() {
  if (!usuarioLogado()) window.location.href = 'acesso.html';
}

// Trocar o botão "Login" do header pelo nome e um botão "Sair"
function atualizarHeader() {
  const area = document.querySelector('.login-container');
  const usuario = usuarioLogado();
  if (!area || !usuario) return;

  const nome = document.createElement('span');
  nome.className = 'usuario-nome';
  nome.textContent = 'Olá, ' + usuario.nome.split(' ')[0];

  const botaoSair = document.createElement('button');
  botaoSair.className = 'btnLogin-popup';
  botaoSair.textContent = 'Sair';
  botaoSair.addEventListener('click', sair);

  area.replaceChildren(nome, botaoSair);
}

atualizarHeader();

// ---------- Ferramenta de testes (rodar pelo console) ----------
// limparDadosDeTeste()                 -> apaga a sessão e todos os cadastros
// limparDadosDeTeste('seu@email.com')  -> apaga só esse usuário e a sessão
function limparDadosDeTeste(email) {
  localStorage.removeItem('usuarioLogado');

  if (email) {
    let lista = [];
    try {
      lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    } catch {}
    const restantes = lista.filter((u) => u.email !== email.trim().toLowerCase());
    localStorage.setItem('usuarios', JSON.stringify(restantes));
    console.log('Usuários removidos: ' + (lista.length - restantes.length));
  } else {
    localStorage.removeItem('usuarios');
    console.log('Sessão e cadastros apagados.');
  }
}