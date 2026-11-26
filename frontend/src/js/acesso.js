// Cadastro e login utilizam a API e as sessões HTTP do backend.
// Não persistir CPF, e-mail, senha ou dados da conta no localStorage.
// Apaga SOMENTE chaves antigas do DogSchool; não interfere no PostgreSQL.
for (const chave of ['usuarios', 'usuarioLogado', 'tentativasLogin']) {
  try { localStorage.removeItem(chave); } catch {}
}

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


function setCarregando(botao, carregando, textoNormal, textoCarregando) {
  botao.disabled = carregando;
  botao.textContent = carregando ? textoCarregando : textoNormal;
}

// ---------- Limite de tentativas de login ----------
const MAX_TENTATIVAS = 3;
const TEMPOS_BLOQUEIO = [30, 90, 180]; // segundos: 30s, 1m30s, 3m
// Limite visual desta página: mantido só em memória; nunca armazena CPF.
// O limite de segurança verdadeiro permanece no backend (express-rate-limit).
const tentativasEmMemoria = new Map();

function lerTentativas(cpf) {
  return tentativasEmMemoria.get(cpf) || { falhas: 0, bloqueios: 0, ate: 0 };
}

function salvarTentativas(cpf, dados) {
  tentativasEmMemoria.set(cpf, dados);
}

function limparTentativas(cpf) {
  tentativasEmMemoria.delete(cpf);
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

// ---------- CADASTRO E LOGIN PELO BACKEND ----------
// api.js deve ser carregado antes deste arquivo em acesso.html.
async function cadastrarUsuario({ nome, email, cpf, senha }) {
  const { response, data } = await window.apiAuth('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, cpf, senha, termosAceitos: true }),
  });

  if (!response.ok) {
    return {
      success: false,
      campo: data.campo || null,
      error: data.mensagem || 'Não foi possível concluir o cadastro.',
    };
  }

  return { success: true, message: data.mensagem || 'Cadastro realizado! Faça login.' };
}

async function autenticarUsuario({ cpf, senha }) {
  const { response, data, respostaInvalida } = await window.apiAuth('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cpf, senha }),
  });

  if (respostaInvalida) {
    return { success: false, contarTentativa: false,
      error: 'Falha na comunicação com o servidor. Tente novamente mais tarde.' };
  }

  // Somente HTTP 401 desta rota representa credenciais incorretas.
  if (response.status === 401) {
    return { success: false, contarTentativa: true,
      error: 'CPF ou senha incorretos!' };
  }

  if (response.status === 429) {
    return { success: false, contarTentativa: false,
      error: 'Muitas tentativas de login. Aguarde alguns minutos.' };
  }

  if (!response.ok) {
    return { success: false, contarTentativa: false,
      error: response.status === 400
        ? (data.mensagem || 'Confira o CPF e a senha informados.')
        : 'Não foi possível entrar. Tente novamente mais tarde.' };
  }

  if (!data.usuario?.id) {
    return { success: false, contarTentativa: false,
      error: 'Resposta de login inválida. Tente novamente mais tarde.' };
  }

  return { success: true, usuario: data.usuario };
}
// ---------- FIM DA INTEGRAÇÃO COM O BACKEND ----------

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
    if (senha.length < 8) {
      mostrarErro(signupForm.senha, 'Mínimo de 8 caracteres!');
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
        if (data.campo && signupForm[data.campo]) {
          mostrarErro(signupForm[data.campo], data.error);
        } else {
          mostrarToast(data.error, 'erro');
        }
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
        // Sessão: gerenciada somente pelo backend via cookie HttpOnly.
        const destino = sessionStorage.getItem('voltarPara') || 'index.html';
        sessionStorage.removeItem('voltarPara');
        window.location.href = destino;
      } else if (data.contarTentativa) {
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
      } else {
        // Erro de rede/API não é falha de senha e não deve consumir tentativas.
        mostrarToast(data.error, 'erro');
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