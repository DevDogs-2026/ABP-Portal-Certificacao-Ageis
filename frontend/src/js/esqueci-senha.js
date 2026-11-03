
const forgotForm = document.getElementById('forgotform');

async function hashSenha(senha) {
  const bytes = new TextEncoder().encode(senha);
  const buffer = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function setCarregando(botao, carregando) {
  botao.disabled = carregando;
  botao.textContent = carregando ? 'Redefinindo...' : 'Redefinir';
}

async function redefinirSenha(email, senha) {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const indice = usuarios.findIndex(
    (usuario) => usuario?.email?.trim().toLowerCase() === email
  );

  if (indice === -1) {
    return { success: false, error: 'Não encontramos uma conta com este email.' };
  }

  usuarios[indice].senhaHash = await hashSenha(senha);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  return { success: true };
}

forgotForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = forgotForm.email.value.trim().toLowerCase();
  const senha = forgotForm.senha.value;
  const confirmacaoSenha = forgotForm.confirmacaoSenha.value;

  if (!forgotForm.email.validity.valid) {
    alert('Email inválido!');
    return;
  }
  if (senha.length < 6) {
    alert('A senha deve ter no mínimo 6 caracteres!');
    return;
  }
  if (senha !== confirmacaoSenha) {
    alert('As senhas não correspondem!');
    return;
  }

  const submitBtn = forgotForm.querySelector('button[type="submit"]');
  setCarregando(submitBtn, true);

  try {
    const data = await redefinirSenha(email, senha);

    if (data.success) {
      alert('Senha redefinida com sucesso. Faça login com a nova senha.');
      forgotForm.reset();
      window.location.href = 'acesso.html';
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('Ocorreu um erro. Tente novamente.');
    console.error(error);
  } finally {
    setCarregando(submitBtn, false);
  }
});
