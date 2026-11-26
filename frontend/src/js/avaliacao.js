const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

// Abre/fecha o menu no celular.
hamburger.addEventListener('click', () => {
    const aberto = nav.classList.toggle('open');
    hamburger.classList.toggle('open', aberto);
    hamburger.setAttribute('aria-expanded', aberto);
});

// Header ganha fundo ao rolar a página.
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

const botaoIniciar = document.getElementById('iniciar-avaliacao');
const mensagemInicio = document.getElementById('mensagem-inicio');
// A página de regras não altera o cronômetro nem o resultado da tentativa.
// A página de questão é responsável por registrar saídas e recuperar falhas.

// Cria ou retoma uma tentativa autenticada antes de abrir a questão.
async function iniciarAvaliacao() {
    botaoIniciar.disabled = true;
    mensagemInicio.hidden = true;

    try {
        const { response, data } = await window.apiRequest('/assessments/attempts', {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error(data.mensagem || 'Não foi possível iniciar a avaliação.');
        }

        window.location.href = `questao.html?attemptId=${data.idTentativa}`;
    } catch (error) {
        console.error('Erro ao iniciar/retomar a avaliação:', error);
        mensagemInicio.textContent = error.message;
        mensagemInicio.hidden = false;
        botaoIniciar.disabled = false;
    }
}

botaoIniciar.addEventListener('click', iniciarAvaliacao);

// Define o texto do botão conforme existir (ou não) uma avaliação em andamento.
function definirRotuloBotao(emAndamento) {
    botaoIniciar.textContent = emAndamento ? 'Continuar Avaliação' : 'Começar Avaliação';
}

// Consulta as tentativas do usuário para saber se há uma avaliação em andamento.
// Se a consulta falhar, mantém "Começar Avaliação": o POST /attempts já retoma
// a tentativa aberta, então o fluxo continua correto.
let verificacaoAtual = 0;
async function atualizarBotaoAvaliacao() {
    const verificacao = ++verificacaoAtual;

    try {
        const { response, data } = await window.apiRequest('/assessments/attempts');
        if (!response.ok) {
            throw new Error(data.mensagem || 'Não foi possível consultar as avaliações.');
        }

        const tentativas = Array.isArray(data.tentativas) ? data.tentativas : [];
        const emAndamento = tentativas.some((tentativa) => tentativa.status === 'em_andamento');

        // Ignora respostas antigas caso outra verificação tenha começado depois.
        if (verificacao !== verificacaoAtual) return;
        definirRotuloBotao(emAndamento);
    } catch (error) {
        console.error('Erro ao verificar avaliação em andamento:', error);
        if (verificacao !== verificacaoAtual) return;
        definirRotuloBotao(false);
    }

    botaoIniciar.disabled = false;
}

// Roda ao abrir a página e também ao voltar para ela pelo cache do navegador
// (por exemplo, ao retornar de uma questão), sem emitir /pause automaticamente.
window.addEventListener('pageshow', () => {
    mensagemInicio.hidden = true;
    atualizarBotaoAvaliacao();
});
