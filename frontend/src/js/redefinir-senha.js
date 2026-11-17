const resetForm = document.getElementById('resetForm');
const mensagem = document.getElementById('mensagem');
const token = new URLSearchParams(window.location.search).get('token') || '';
const botao = resetForm.querySelector('button[type="submit"]');

if (!/^[a-f0-9]{64}$/i.test(token)) {
    mensagem.textContent = 'Link inválido. Solicite uma nova redefinição de senha.';
    botao.disabled = true;
}

resetForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const senha = resetForm.senha.value;
    const confirmacaoSenha = resetForm.confirmacaoSenha.value;

    if (senha !== confirmacaoSenha) {
        mensagem.textContent = 'As senhas não correspondem.';
        return;
    }

    if (new TextEncoder().encode(senha).length > 72) {
        mensagem.textContent = 'A senha deve ter no máximo 72 bytes.';
        return;
    }

    botao.disabled = true;
    botao.textContent = 'Salvando...';
    mensagem.textContent = '';

    try {
        const { response, data } = await window.apiAuth('/redefinir-senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, senha }),
        });

        if (!response.ok) {
            mensagem.textContent = data.mensagem || 'Não foi possível redefinir a senha.';
            return;
        }

        mensagem.textContent = 'Senha redefinida. Você já pode fazer login.';
        resetForm.reset();
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        mensagem.textContent = 'Erro de conexão. Tente novamente.';
    } finally {
        botao.disabled = false;
        botao.textContent = 'Salvar nova senha';
    }
});