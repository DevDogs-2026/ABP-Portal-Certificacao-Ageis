// Alternância entre os painéis de cadastro e login.
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn?.addEventListener('click', () => container.classList.add('active'));
loginBtn?.addEventListener('click', () => container.classList.remove('active'));

const apenasDigitos = (valor) => valor.replace(/\D/g, '');

function cpfValido(cpf) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
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

const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

// Cadastro real: envia os dados à API. O hash da senha é responsabilidade do servidor.
signupForm?.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const nome_completo = signupForm.elements.nome.value.trim();
  const email = signupForm.elements.email.value.trim().toLowerCase();
  const cpf = apenasDigitos(signupForm.elements.cpf.value);
  const senha = signupForm.elements.senha.value;

  if (nome_completo.length < 3) {
    alert('Informe seu nome completo.');
    return;
  }
  if (!cpfValido(cpf)) {
    alert('Informe um CPF válido.');
    return;
  }
  if (senha.length < 8) {
    alert('A senha deve ter no mínimo 8 caracteres.');
    return;
  }

  const botao = signupForm.querySelector('button[type="submit"]');
  setCarregando(botao, true, 'Cadastrar', 'Cadastrando...');

  try {
    const { response, data } = await window.apiRequest('/candidatos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome_completo, email, cpf, senha }),
    });

    if (!response.ok) {
      alert(data.mensagem || 'Não foi possível realizar o cadastro.');
      return;
    }

    alert('Cadastro realizado com sucesso! Faça login.');
    signupForm.reset();
    container.classList.remove('active');
  } catch (erro) {
    console.error('Erro ao cadastrar candidato:', erro);
    alert('Não foi possível comunicar com o servidor. Tente novamente.');
  } finally {
    setCarregando(botao, false, 'Cadastrar', 'Cadastrando...');
  }
});

// Login por CPF e senha, conforme RF04.
loginForm?.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const cpf = apenasDigitos(loginForm.elements.cpf.value);
  const senha = loginForm.elements.senha.value;
  const botao = loginForm.querySelector('button[type="submit"]');

  if (!/^\d{11}$/.test(cpf) || !senha) {
    alert('Informe CPF e senha.');
    return;
  }

  setCarregando(botao, true, 'Entrar', 'Entrando...');
  try {
    const { response, data } = await window.apiAuth('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, senha }),
    });

    if (!response.ok) {
      alert(data.mensagem || 'CPF ou senha inválidos.');
      return;
    }

    const destino = sessionStorage.getItem('voltarPara') || 'index.html';
    sessionStorage.removeItem('voltarPara');
    window.location.href = destino;
  } catch (erro) {
    console.error('Erro ao comunicar com o servidor:', erro);
    alert('Ocorreu um erro ao comunicar com o servidor. Tente novamente.');
  } finally {
    setCarregando(botao, false, 'Entrar', 'Entrando...');
  }
});
