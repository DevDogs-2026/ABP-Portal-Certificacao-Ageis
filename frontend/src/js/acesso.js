// ============================================================
// Os usuários ficam salvos no localStorage do navegador, só para
// testar o fluxo. Quando o back-end existir, troque as funções
// da seção "ARMAZENAMENTO TEMPORÁRIO" por chamadas fetch().
// ============================================================

// ---------- Referências principais do DOM ----------
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

// ---------- Alternância entre login e cadastro ----------
if (registerBtn && container) {
  registerBtn.addEventListener('click', () => container.classList.add('active'));
}
if (loginBtn && container) {
  loginBtn.addEventListener('click', () => container.classList.remove('active'));
}

// ---------- Notificações Toast (Sucesso e Erro) ----------
function mostrarToast(mensagem, tipo = 'sucesso') {
  let toast = document.getElementById('app-toast');

  // Cria o elemento automaticamente caso ainda não exista no DOM
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  // Define a classe de estilo conforme o tipo ('sucesso' ou 'erro')
  toast.className = tipo === 'erro' ? 'toast-erro' : 'toast-sucesso';
  toast.textContent = mensagem;

  // Garante que a transição de opacidade/movimento do CSS ocorra suavemente
  requestAnimationFrame(() => {
    toast.classList.add('visivel');
  });

  // Oculta o toast automaticamente após 3,5 segundos
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.classList.remove('visivel');
  }, 3500);
}

// ---------- Controle Visual de Erros em Todos os Forms ----------
function mostrarErro(input, mensagem) {
  if (!input) return;
  if (!input.dataset.placeholderOriginal) {
    input.dataset.placeholderOriginal = input.placeholder;
  }
  input.value = '';
  input.placeholder = mensagem;
  input.classList.add('input-erro');
}

function limparErro(input) {
  if (!input) return;
  input.classList.remove('input-erro');
  if (input.dataset.placeholderOriginal) {
    input.placeholder = input.dataset.placeholderOriginal;
  }
}

// ---------- Botão Mostrar/Ocultar Senha (Ícone de Olho) ----------
const ICONE_OLHO_ABERTO = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
`;

const ICONE_OLHO_FECHADO = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
`;

function configurarBotaoSenha(input) {
  const wrapper = input.closest('.input-icon');
  if (!wrapper || wrapper.querySelector('.toggle-senha')) return;

  input.setAttribute('data-tem-olho', 'true');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'toggle-senha';
  btn.setAttribute('aria-label', 'Mostrar senha');
  btn.innerHTML = ICONE_OLHO_ABERTO;

  btn.addEventListener('click', () => {
    const oculta = input.type === 'password';
    input.type = oculta ? 'text' : 'password';
    btn.innerHTML = oculta ? ICONE_OLHO_FECHADO : ICONE_OLHO_ABERTO;
    btn.setAttribute('aria-label', oculta ? 'Ocultar senha' : 'Mostrar senha');
    input.focus();
  });

  const form = input.closest('form');
  if (form) {
    form.addEventListener('reset', () => {
      input.type = 'password';
      btn.innerHTML = ICONE_OLHO_ABERTO;
      btn.setAttribute('aria-label', 'Mostrar senha');
    });
  }

  wrapper.appendChild(btn);
}

// ---------- Utilidades e Máscara de CPF ----------
const apenasDigitos = (txt) => txt.replace(/\D/g, '');

function formatarCPF(valor) {
  return apenasDigitos(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

// Aplica limpeza de erro, máscara de CPF, olho na senha e desativa balões nativos
document.querySelectorAll('form').forEach((form) => {
  form.setAttribute('novalidate', 'true');

  form.querySelectorAll('input').forEach((input) => {
    if (input.type !== 'checkbox') {
      input.dataset.placeholderOriginal = input.placeholder;
    }

    if (input.name === 'cpf') {
      input.setAttribute('maxlength', '14');
      input.setAttribute('inputmode', 'numeric');
    }

    if (input.type === 'password') {
      configurarBotaoSenha(input);
    }

    input.addEventListener('input', () => {
      limparErro(input);
      if (input.name === 'cpf') {
        input.value = formatarCPF(input.value);
      }
    });
  });
});

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

// ---------- Limite de tentativas de login ----------
const MAX_TENTATIVAS = 3;
const TEMPOS_BLOQUEIO = [30, 90, 180]; // segundos: 30s, 1m30s, 3m
const CHAVE_TENTATIVAS = 'tentativasLogin';

function lerTodasTentativas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_TENTATIVAS)) || {};
  } catch {
    return {};
  }
}

function lerTentativas(cpf) {
  return lerTodasTentativas()[cpf] || { falhas: 0, bloqueios: 0, ate: 0 };
}

function salvarTentativas(cpf, dados) {
  const todas = lerTodasTentativas();
  todas[cpf] = dados;
  localStorage.setItem(CHAVE_TENTATIVAS, JSON.stringify(todas));
}

function limparTentativas(cpf) {
  const todas = lerTodasTentativas();
  delete todas[cpf];
  localStorage.setItem(CHAVE_TENTATIVAS, JSON.stringify(todas));
}

function segundosRestantes(cpf) {
  return Math.max(0, Math.ceil((lerTentativas(cpf).ate - Date.now()) / 1000));
}

function formatarTempo(seg) {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return m > 0 ? `${m}m${String(s).padStart(2, '0')}s` : `${s}s`;
}

function registrarFalha(cpf) {
  const d = lerTentativas(cpf);
  d.falhas += 1;

  if (d.falhas >= MAX_TENTATIVAS) {
    const indice = Math.min(d.bloqueios, TEMPOS_BLOQUEIO.length - 1);
    d.ate = Date.now() + TEMPOS_BLOQUEIO[indice] * 1000;
    d.bloqueios += 1;
    d.falhas = 0;
  }

  salvarTentativas(cpf, d);
  return d;
}

let timerBloqueio = null;

function iniciarContagem(cpf) {
  const botao = loginForm.querySelector('button[type="submit"]');
  clearInterval(timerBloqueio);

  const atualizar = () => {
    const resta = segundosRestantes(cpf);
    if (resta <= 0) {
      clearInterval(timerBloqueio);
      botao.disabled = false;
      botao.textContent = 'Entrar';
      limparErro(loginForm.cpf);
      limparErro(loginForm.senha);
      return;
    }
    botao.disabled = true;
    botao.textContent = `Aguarde ${formatarTempo(resta)}`;
  };

  atualizar();
  timerBloqueio = setInterval(atualizar, 1000);
}
// ---------- FIM DO LIMITE DE TENTATIVAS ----------

// ---------- ARMAZENAMENTO TEMPORÁRIO (substituir pelo back-end depois) ----------
const CHAVE_USUARIOS = 'usuarios';
const VERSAO_TERMOS = '1.0';

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
    return { success: false, campo: 'cpf', error: 'Este CPF já está cadastrado!' };
  }
  if (usuarios.some((u) => u.email === email)) {
    return { success: false, campo: 'email', error: 'Este e-mail já está cadastrado!' };
  }

  usuarios.push({
    id: Date.now(),
    nome,
    email,
    cpf,
    senhaHash: await hashSenha(senha),
    termosAceitosEm: new Date().toISOString(),
    versaoTermos: VERSAO_TERMOS,
  });
  salvarUsuarios(usuarios);

  return { success: true, message: 'Cadastro realizado com sucesso! Faça login.' };
}

async function autenticarUsuario({ cpf, senha }) {
  const usuario = lerUsuarios().find((u) => u.cpf === cpf);

  if (!usuario || usuario.senhaHash !== (await hashSenha(senha))) {
    return { success: false, error: 'CPF ou senha incorretos!' };
  }

  return {
    success: true,
    message: `Bem-vindo, ${usuario.nome}!`,
    usuario: { id: usuario.id, nome: usuario.nome },
  };
}
// ---------- FIM DO ARMAZENAMENTO TEMPORÁRIO ----------

// ---------- Formulários ----------

// Cadastro
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = signupForm.nome.value.trim();
    const email = signupForm.email.value.trim().toLowerCase();
    const cpf = apenasDigitos(signupForm.cpf.value);
    const senha = signupForm.senha.value;

    let temErro = false;

    if (!nome) {
      mostrarErro(signupForm.nome, 'O nome é obrigatório!');
      temErro = true;
    }
    if (!email || !email.includes('@')) {
      mostrarErro(signupForm.email, 'Digite um e-mail válido!');
      temErro = true;
    }
    if (!cpfValido(cpf)) {
      mostrarErro(signupForm.cpf, 'CPF inválido!');
      temErro = true;
    }
    if (senha.length < 6) {
      mostrarErro(signupForm.senha, 'Mínimo de 6 caracteres!');
      temErro = true;
    }
    if (!signupForm.termos.checked) {
      mostrarToast('Você precisa aceitar os Termos de Uso e a Política de Privacidade.', 'erro');
      temErro = true;
    }
    if (temErro) return;

    const submitBtn = signupForm.querySelector('button[type="submit"]');
    setCarregando(submitBtn, true, 'Cadastrar', 'Cadastrando...');
    try {
      const data = await cadastrarUsuario({ nome, email, cpf, senha });
      if (data.success) {
        mostrarToast(data.message, 'sucesso');
        signupForm.reset();
        container.classList.remove('active');
      } else {
        mostrarErro(signupForm[data.campo], data.error);
      }
    } catch (error) {
      mostrarToast('Ocorreu um erro. Tente novamente.', 'erro');
      console.error(error);
    } finally {
      setCarregando(submitBtn, false, 'Cadastrar', 'Cadastrando...');
    }
  });
}

// Login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cpf = apenasDigitos(loginForm.cpf.value);
    const senha = loginForm.senha.value;
    let temErro = false;

    if (!cpf) {
      mostrarErro(loginForm.cpf, 'Digite seu CPF!');
      temErro = true;
    }
    if (!senha) {
      mostrarErro(loginForm.senha, 'Digite sua senha!');
      temErro = true;
    }
    if (temErro) return;

    const resta = segundosRestantes(cpf);
    if (resta > 0) {
      mostrarErro(loginForm.senha, `Bloqueado! Aguarde ${formatarTempo(resta)}`);
      iniciarContagem(cpf);
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    setCarregando(submitBtn, true, 'Entrar', 'Entrando...');
    try {
      const data = await autenticarUsuario({ cpf, senha });
      if (data.success) {
        limparTentativas(cpf);
        localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));
        const destino = sessionStorage.getItem('voltarPara') || 'index.html';
        sessionStorage.removeItem('voltarPara');
        window.location.href = destino;
      } else {
        const dados = registrarFalha(cpf);
        const bloqueio = segundosRestantes(cpf);
        if (bloqueio > 0) {
          mostrarErro(loginForm.cpf, 'Tentativas esgotadas!');
          mostrarErro(loginForm.senha, `Aguarde ${formatarTempo(bloqueio)}`);
          iniciarContagem(cpf);
        } else {
          const restantes = MAX_TENTATIVAS - dados.falhas;
          mostrarErro(loginForm.cpf, data.error);
          mostrarErro(loginForm.senha, `Restam ${restantes} tentativa(s)`);
        }
      }
    } catch (error) {
      mostrarToast('Ocorreu um erro. Tente novamente.', 'erro');
      console.error(error);
    } finally {
      if (segundosRestantes(cpf) === 0) {
        setCarregando(submitBtn, false, 'Entrar', 'Entrando...');
      }
    }
  });
}