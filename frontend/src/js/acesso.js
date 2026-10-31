// ============================================================
// Os usuários ficam salvos no localStorage do navegador, só para
// testar o fluxo. Quando o back-end existir, trocae as funções
// da seção "ARMAZENAMENTO TEMPORÁRIO" por chamadas fetch().
// ============================================================

// ---------- Alternância entre login e cadastro ----------
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn.addEventListener('click', () => container.classList.remove('active'));

// ---------- Utilidades ----------
const apenasDigitos = (txt) => txt.replace(/\D/g, '');

function cpfValido(cpf) {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  for (let tamanho = 9; tamanho <= 10; tamanho++) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(cpf[i]) * (tamanho + 1 - i);
    }
    const digito = ((soma * 10) % 11) % 10;
    if (digito !== Number(cpf[tamanho])) return false;
  }
  return true;
}

// Guarda um hash da senha (SHA-256) em vez da senha em texto puro.
// Isso é só um quebra-galho para testes: no back-end de verdade usar
// bcrypt ou argon2 com salt, de preferencia o bcrypt.
async function hashSenha(senha) {
  const bytes = new TextEncoder().encode(senha);
  const buffer = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function setCarregando(botao, carregando, textoNormal, textoCarregando) {
  botao.disabled = carregando;
  botao.textContent = carregando ? textoCarregando : textoNormal;
}

// ---------- ARMAZENAMENTO TEMPORÁRIO (substituir pelo back-end depois) ----------
const CHAVE_USUARIOS = 'usuarios';

function lerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
  } catch {
    return [];
  }
}

function salvarUsuarios(lista) {
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista));
}

async function cadastrarUsuario({ nome, email, cpf, senha }) {
  const usuarios = lerUsuarios();

  if (usuarios.some((u) => u.cpf === cpf)) {
    return { success: false, error: 'Este CPF já está cadastrado.' };
  }
  if (usuarios.some((u) => u.email === email)) {
    return { success: false, error: 'Este e-mail já está cadastrado.' };
  }

  usuarios.push({
    id: Date.now(),
    nome,
    email,
    cpf,
    senhaHash: await hashSenha(senha),
  });
  salvarUsuarios(usuarios);

  return { success: true, message: 'Cadastro realizado com sucesso! Faça login.' };
}

async function autenticarUsuario({ cpf, senha }) {
  const usuario = lerUsuarios().find((u) => u.cpf === cpf);

  if (!usuario || usuario.senhaHash !== (await hashSenha(senha))) {
    return { success: false, error: 'CPF ou senha incorretos.' };
  }

  return {
    success: true,
    message: `Bem-vindo, ${usuario.nome}!`,
    usuario: { id: usuario.id, nome: usuario.nome },
  };
}
// ---------- FIM DO ARMAZENAMENTO TEMPORÁRIO ----------

// ---------- Formulários ----------
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

// Cadastro
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = signupForm.nome.value.trim();
  const email = signupForm.email.value.trim().toLowerCase();
  const cpf = apenasDigitos(signupForm.cpf.value);
  const senha = signupForm.senha.value;

  if (!cpfValido(cpf)) {
    alert('CPF inválido!');
    return;
  }
  if (senha.length < 6) {
    alert('A senha deve ter no mínimo 6 caracteres!');
    return;
  }

  const submitBtn = signupForm.querySelector('button[type="submit"]');
  setCarregando(submitBtn, true, 'Cadastrar', 'Cadastrando...');

  try {
    const data = await cadastrarUsuario({ nome, email, cpf, senha });

    if (data.success) {
      alert(data.message);
      signupForm.reset();
      container.classList.remove('active');
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('Ocorreu um erro. Tente novamente.');
    console.error(error);
  } finally {
    setCarregando(submitBtn, false, 'Cadastrar', 'Cadastrando...');
  }
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const cpf = apenasDigitos(loginForm.cpf.value);
  const senha = loginForm.senha.value;

  const submitBtn = loginForm.querySelector('button[type="submit"]');
  setCarregando(submitBtn, true, 'Entrar', 'Entrando...');

  try {
    const data = await autenticarUsuario({ cpf, senha });

    if (data.success) {
      // Guarda só id e nome — nunca senha nem CPF
      localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
      window.location.href = './index.html';
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('Ocorreu um erro. Tente novamente.');
    console.error(error);
  } finally {
    setCarregando(submitBtn, false, 'Entrar', 'Entrando...');
  }
});