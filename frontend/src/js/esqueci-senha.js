const forgotForm = document.getElementById('forgotform');

forgotForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = forgotForm.email.value.trim();
    const botao = forgotForm.querySelector('button[type="submit"]');

    if (!forgotForm.email.validity.valid) {
        alert('Digite um e-mail válido.');
        return;
    }

    botao.disabled = true;
    botao.textContent = 'Enviando...';

    try {
        const { response, data } = await window.apiAuth(
            '/solicitar-redefinicao',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            }
        );

        if (!response.ok) {
            throw new Error(data.mensagem || 'Não foi possível enviar a solicitação.');
        }

        alert(data.mensagem);
        forgotForm.reset();
    } catch (error) {
        console.error('Erro ao solicitar redefinição:', error);
        alert(error.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
        botao.disabled = false;
        botao.textContent = 'Enviar instruções';
    }
});