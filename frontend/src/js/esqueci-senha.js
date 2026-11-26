const formulario = document.getElementById('forgotform');
const aviso = document.getElementById('aviso-recuperacao');
if (formulario) {
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const email = formulario.elements.email.value.trim();
    const botao = formulario.querySelector('button[type="submit"]');
    botao.disabled = true;
    aviso.textContent = 'Enviando solicitação…';
    aviso.classList.remove('erro');
    try {
      const { response, data } = await window.apiAuth('/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      aviso.textContent = data.mensagem || 'Não foi possível processar a solicitação.';
      aviso.classList.toggle('erro', !response.ok);
      if (response.ok) formulario.reset();
    } catch (_) {
      aviso.classList.add('erro');
      aviso.textContent = 'Erro de conexão. Tente novamente.';
    } finally {
      botao.disabled = false;
    }
  });
}
