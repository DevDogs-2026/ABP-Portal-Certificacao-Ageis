const botaoContainer = document.getElementById('btn-confirma');
const botaoConfirmar = botaoContainer.querySelector('button');
const painelContinuar = document.getElementById('cont-pausa');
const painelTempo = document.getElementById('limite-tempo');
const cabecalho = document.getElementById('header');
const conteudo = document.getElementById('main');
const tempoSpan = document.getElementById('tempo');
const numeroTema = document.getElementById('tema');
const textoQuestao = document.getElementById('questao-texto');
const imagemQuestao = document.querySelector('.main__questao_img');
const mensagemErro = document.getElementById('erro-avaliacao');
const alternativas = ['a', 'b', 'c', 'd'].map((letra) =>
    document.getElementById(`alternativa-${letra}`)
);

const idTentativa = new URLSearchParams(window.location.search).get('attemptId');
const TEMPO_TOTAL = 150;
const TEMPO_EXIBICAO_GABARITO = 5000; // 5 segundos mostrando a resposta correta na tela

let alternativaSelecionada = null;
let cronometro = null;
let timerFeedback = null;
let encerrada = false;
let enviandoResposta = false;
let tentativaConcluida = false;
let tempoEsgotado = false;
let carregamentoPendente = null;
let processandoSaida = false;
let idProgressoAtual = null;

// Habilita seleção por mouse e teclado nas alternativas exibidas na questão.
function configurarAlternativa(alternativa) {
    alternativa.setAttribute('role', 'radio');
    alternativa.setAttribute('aria-checked', 'false');
    alternativa.setAttribute('tabindex', '0');
    alternativa.addEventListener('click', selecionarAlternativa);
    alternativa.addEventListener('keydown', selecionarAlternativaTeclado);
}

// Atualiza a alternativa selecionada e habilita o botão de confirmação.
function selecionarAlternativa(evento) {
    if (encerrada || tempoEsgotado) return;

    alternativas.forEach((alternativa) => {
        alternativa.classList.remove('main__alternativa_selecionada');
        alternativa.setAttribute('aria-checked', 'false');
    });

    const alternativa = evento.currentTarget;
    alternativaSelecionada = Number(alternativa.dataset.idAlternativa);
    alternativa.classList.add('main__alternativa_selecionada');
    alternativa.setAttribute('aria-checked', 'true');
    botaoConfirmar.disabled = false;
    botaoContainer.classList.remove('main__botao_off');
    botaoContainer.classList.add('main__botao');
}

// Permite selecionar uma alternativa com Enter ou barra de espaço.
function selecionarAlternativaTeclado(evento) {
    if (evento.key !== 'Enter' && evento.key !== ' ') return;
    evento.preventDefault();
    selecionarAlternativa(evento);
}

// Atualiza o enunciado, tema e opções com os dados enviados pelo backend.
function renderizarQuestao(dados) {
    const questao = dados.questao;
    numeroTema.textContent = dados.numeroQuestao;
    textoQuestao.textContent = questao.enunciado;
    alternativaSelecionada = null;
    botaoConfirmar.disabled = true;

    if (questao.imagemUrl) {
        imagemQuestao.src = questao.imagemUrl;
        imagemQuestao.alt = questao.enunciado;
        imagemQuestao.hidden = false;
    } else {
        imagemQuestao.hidden = true;
    }

    questao.alternativas.forEach((opcao, indice) => {
        const elemento = alternativas[indice];
        elemento.dataset.idAlternativa = opcao.id;
        elemento.dataset.letra = String(opcao.letra || '').trim().toUpperCase();
        elemento.querySelector('.main__alternativa').textContent = opcao.letra;
        elemento.querySelector('.main__alternativa_texto').textContent = opcao.texto;
        elemento.classList.remove(
            'main__alternativa_selecionada',
            'main__alternativa_certo',
            'main__alternativa_errado'
        );
        elemento.setAttribute('aria-checked', 'false');
    });
}

// Inicia o cronômetro com o tempo restante calculado pelo servidor.
function iniciarCronometro(segundos) {
    if (cronometro !== null) window.clearInterval(cronometro);
    cronometro = null;
    let restante = Math.max(0, Math.min(TEMPO_TOTAL, segundos));
    tempoSpan.textContent = `${restante}s`;
    if (restante === 0) {
        tempoEsgotado = true;
        enviarResposta(null);
        return;
    }

    cronometro = window.setInterval(atualizarCronometro, 1000);

    // Atualiza o contador e registra timeout ao chegar a zero.
    function atualizarCronometro() {
        restante -= 1;
        tempoSpan.textContent = `${Math.max(0, restante)}s`;

        if (restante <= 0) {
            window.clearInterval(cronometro);
            tempoEsgotado = true;
            enviarResposta(null);
        }
    }
}

// Envia a resposta selecionada; o servidor verifica a alternativa e o tempo.
async function enviarResposta(idAlternativa) {
    if (encerrada || enviandoResposta) return;
    enviandoResposta = true;
    botaoConfirmar.disabled = true;
    mensagemErro.hidden = true;

    if (cronometro) window.clearInterval(cronometro);

    try {
        const { response, data } = await window.apiRequest(
            `/assessments/attempts/${idTentativa}/answers`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idAlternativa, idProgresso: idProgressoAtual }),
            }
        );
        if (!response.ok) {
            throw new Error(data.mensagem || 'Não foi possível registrar sua resposta.');
        }

        encerrada = true;
        tentativaConcluida = Boolean(data.concluida);
        mostrarFeedback(data);
    } catch (error) {
        console.error('Erro ao registrar a resposta:', error);
        mensagemErro.textContent = error.message;
        mensagemErro.hidden = false;
        botaoConfirmar.disabled = false;
        enviandoResposta = false;
    }
}

// Destaca a alternativa correta na tela por 5s antes de abrir o painel de decisão.
function mostrarFeedback(resposta) {
    const letraCorreta = String(
        resposta.alternativaCorreta || resposta.correta || ''
    ).trim().toUpperCase();

    let textoAlternativaCorreta = '';

    // 1. Destaca imediatamente a alternativa correta (verde) e a errada selecionada (vermelho)
    alternativas.forEach((alternativa) => {
        const letraOpcao = String(alternativa.dataset.letra || '').trim().toUpperCase();
        if (letraOpcao === letraCorreta) {
            alternativa.classList.add('main__alternativa_certo');
            const textoOpcao = alternativa.querySelector('.main__alternativa_texto')?.textContent || '';
            textoAlternativaCorreta = `${letraCorreta}) ${textoOpcao}`;
        } else if (
            alternativa.dataset.idAlternativa === String(alternativaSelecionada) &&
            !resposta.correto
        ) {
            alternativa.classList.add('main__alternativa_errado');
        }
    });

    // Oculta o botão de confirmar e mantém a tela nítida durante os 5 segundos
    botaoContainer.classList.remove('main__botao');
    botaoContainer.classList.add('main__botao_off');
    conteudo.classList.remove('desfoque');

    if (timerFeedback) window.clearTimeout(timerFeedback);

    // 2. Aguarda 5 segundos para o candidato visualizar o gabarito antes de exibir o modal
    timerFeedback = window.setTimeout(() => {
        if (processandoSaida) return;

        const painel = tempoEsgotado ? painelTempo : painelContinuar;
        painel.classList.remove(
            tempoEsgotado ? 'limite__tempo_div_off' : 'continuar__pausar_div_off'
        );
        painel.classList.add(
            tempoEsgotado ? 'limite__tempo_div' : 'continuar__pausar_div'
        );

        // Mostra apenas um título e uma mensagem, sem os parágrafos antigos.
        const titulo = painel.querySelector('.feedback-titulo');
        const mensagem = painel.querySelector(
            tempoEsgotado ? '#limite-tempo-mensagem' : '#cont-pausa-mensagem'
        );
        const orientacao = painel.querySelector('.feedback-orientacao');
        const botaoAvancar = painel.querySelector(
            tempoEsgotado ? '#proxima-questao-tempo' : '#proxima-questao'
        );

        const infoGabarito = textoAlternativaCorreta
            ? `Alternativa correta: ${textoAlternativaCorreta}`
            : letraCorreta
                ? `Alternativa correta: ${letraCorreta}`
                : 'Consulte o resultado para conferir a resposta.';

        if (tentativaConcluida) {
            titulo.textContent = 'Avaliação concluída!';
            orientacao.textContent = 'Confira seu resultado ou acesse seu progresso.';
            botaoAvancar.textContent = 'Ver resultado';
        } else {
            titulo.textContent = tempoEsgotado
                ? 'Tempo esgotado!'
                : resposta.correto
                    ? 'Você acertou!'
                    : 'Resposta incorreta.';
            orientacao.textContent = 'Avance para a próxima questão ou acompanhe seu progresso.';
            botaoAvancar.textContent = 'Próxima questão';
        }

        mensagem.textContent = infoGabarito;

        cabecalho.classList.remove('header');
        cabecalho.classList.add('header__off');
    }, TEMPO_EXIBICAO_GABARITO);
}

// Carrega do servidor a próxima questão ainda não respondida.
async function carregarQuestao() {
    if (!/^\d+$/.test(idTentativa || '')) {
        window.location.replace('avaliacao.html');
        return;
    }
    if (processandoSaida || carregamentoPendente) return;

    const tarefa = (async () => {
        mensagemErro.hidden = true;
        try {
            const retomada = await window.apiRequest(
                `/assessments/attempts/${idTentativa}/resume`,
                { method: 'POST' }
            );
            if (!retomada.response.ok) {
                throw new Error(retomada.data.mensagem || 'Não foi possível retomar a avaliação.');
            }
            if (processandoSaida) return;
            if (retomada.data.concluida) {
                window.location.replace(`resultado.html?attemptId=${idTentativa}`);
                return;
            }

            const { response, data } = await window.apiRequest(
                `/assessments/attempts/${idTentativa}/current`
            );
            if (!response.ok) {
                throw new Error(data.mensagem || 'Não foi possível carregar a questão.');
            }
            if (processandoSaida) return;
            if (data.concluida) {
                window.location.replace(`resultado.html?attemptId=${idTentativa}`);
                return;
            }

            encerrada = false;
            enviandoResposta = false;
            idProgressoAtual = Number(data.idProgresso);
            tempoEsgotado = false;
            renderizarQuestao(data);
            iniciarCronometro(data.restanteSegundos);
        } catch (error) {
            if (processandoSaida) return;
            console.error('Erro ao carregar a questão:', error);
            mensagemErro.textContent = error.message;
            mensagemErro.hidden = false;
            botaoConfirmar.disabled = true;
        }
    })();
    carregamentoPendente = tarefa;
    try {
        await tarefa;
    } finally {
        if (carregamentoPendente === tarefa) carregamentoPendente = null;
    }
}
// Vai para a próxima pergunta ou para o resultado depois da confirmação final.
function avancarAvaliacao() {
    if (timerFeedback) window.clearTimeout(timerFeedback);
    if (tentativaConcluida) {
        window.location.href = `resultado.html?attemptId=${idTentativa}`;
        return;
    }
    painelContinuar.classList.add('continuar__pausar_div_off');
    painelContinuar.classList.remove('continuar__pausar_div');
    painelTempo.classList.add('limite__tempo_div_off');
    painelTempo.classList.remove('limite__tempo_div');
    cabecalho.classList.remove('header__off');
    cabecalho.classList.add('header');
    conteudo.classList.remove('desfoque');
    carregarQuestao();
}
// Registra a questão atual como incorreta quando o candidato fecha ou recarrega a página.
function encerrarComoIncorretaPorSaida() {
    if (encerrada || enviandoResposta || tentativaConcluida || processandoSaida ||
        !Number.isSafeInteger(idProgressoAtual) || idProgressoAtual <= 0 ||
        !/^\d+$/.test(idTentativa || '')) {
        return;
    }

    if (cronometro !== null) window.clearInterval(cronometro);
    cronometro = null;
    encerrada = true;

    // Enviar null significa que nenhuma alternativa foi escolhida: o servidor registra erro.
    window.apiRequest(`/assessments/attempts/${idTentativa}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idAlternativa: null, idProgresso: idProgressoAtual }),
        keepalive: true,
    }).catch((error) => console.error('Falha ao registrar a questão como incorreta:', error));
}

// Registra a questão atual como incorreta antes de sair da tela de prova.
async function sairEncerrandoQuestao(destino) {
    if (processandoSaida) return;
    processandoSaida = true;
    if (cronometro !== null) window.clearInterval(cronometro);
    if (timerFeedback) window.clearTimeout(timerFeedback);
    cronometro = null;
    try {
        if (carregamentoPendente) await carregamentoPendente;
        if (!encerrada && !tentativaConcluida && Number.isSafeInteger(idProgressoAtual) && idProgressoAtual > 0) {
            const { response, data } = await window.apiRequest(
                `/assessments/attempts/${idTentativa}/answers`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idAlternativa: null, idProgresso: idProgressoAtual }),
                }
            );
            if (!response.ok) {
                throw new Error(data.mensagem || 'Não foi possível encerrar a questão como incorreta.');
            }
            encerrada = true;
        }
    } catch (erro) {
        console.error('Falha ao encerrar a questão:', erro);
    } finally {
        window.location.replace(destino);
    }
}
// Intercepta fechamento de aba, atualização (F5) ou saída direta da página.
window.addEventListener('pagehide', encerrarComoIncorretaPorSaida);
// Intercepta o botão Voltar do navegador e encerra a questão como incorreta antes de sair.
window.history.pushState({ dogsQuestao: true }, '', window.location.href);
window.addEventListener('popstate', () => {
    sairEncerrandoQuestao('avaliacao.html');
});
// Botão "Ver progresso" / "Encerrar sessão" encerra a questão em aberto como incorreta antes de sair.
function pausarAvaliacao() {
    sairEncerrandoQuestao('progresso.html');
}
// Páginas antigas restauradas pelo cache do navegador redirecionam para a tela inicial da avaliação.
window.addEventListener('pageshow', (evento) => {
    if (evento.persisted) {
        if (cronometro !== null) window.clearInterval(cronometro);
        cronometro = null;
        window.location.replace('avaliacao.html');
    }
});
// Confirma a alternativa escolhida ou registra o timeout.
function confirmarResposta() {
    enviarResposta(tempoEsgotado ? null : alternativaSelecionada);
}
alternativas.forEach(configurarAlternativa);
botaoConfirmar.addEventListener('click', confirmarResposta);
document.getElementById('proxima-questao-tempo').addEventListener('click', avancarAvaliacao);
document.getElementById('proxima-questao').addEventListener('click', avancarAvaliacao);
document.getElementById('pausar-certificado-tempo').addEventListener('click', pausarAvaliacao);
document.getElementById('pausar-certificado').addEventListener('click', pausarAvaliacao);
carregarQuestao();
