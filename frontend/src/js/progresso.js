const estadoProgresso = document.getElementById('estado-progresso');
const erroProgresso = document.getElementById('erro-progresso');
const resumoProgresso = document.getElementById('resumo-progresso');
const listaTentativas = document.getElementById('lista-tentativas');
const botaoIniciar = document.getElementById('iniciar-avaliacao');

// Formata as datas devolvidas pelo banco para leitura local.
function formatarData(data) {
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(data));
}

// Cria o cartão acessível de uma tentativa sem inserir conteúdo HTML não confiável.
function criarCartaoTentativa(tentativa) {
    const item = document.createElement('li');
    item.className = 'tentativa';

    const detalhes = document.createElement('div');
    const titulo = document.createElement('h3');
    titulo.textContent = `Avaliação de ${formatarData(tentativa.iniciadaEm)}`;

    const status = document.createElement('p');
    status.className = 'status-tentativa';
    if (tentativa.status === 'concluida') {
        status.classList.add(tentativa.aprovado ? 'status-aprovado' : 'status-reprovado');
        status.textContent = tentativa.aprovado ? 'Aprovado' : 'Reprovado';
    } else {
        status.classList.add('status-andamento');
        status.textContent = 'Em andamento';
    }

    const desempenho = document.createElement('p');
    desempenho.textContent = tentativa.status === 'concluida'
        ? `${tentativa.acertos} de ${tentativa.totalQuestoes} acertos · ${tentativa.percentual.toLocaleString('pt-BR')}%`
        : `${tentativa.respondidas} de ${tentativa.totalQuestoes} questões respondidas`;

    detalhes.append(titulo, status, desempenho);
    item.appendChild(detalhes);

    const link = document.createElement('a');
    link.className = 'botao';
    if (tentativa.status === 'concluida') {
        link.href = `resultado.html?attemptId=${tentativa.id}`;
        link.textContent = 'Ver resultado';
    } else {
        link.href = `questao.html?attemptId=${tentativa.id}`;
        link.textContent = 'Continuar avaliação';
    }
    item.appendChild(link);
    return item;
}

// Atualiza os indicadores gerais, a barra de progresso e a lista do histórico.
function renderizarHistorico(tentativas) {
    const concluidas = tentativas.filter((tentativa) => tentativa.status === 'concluida');
    const emAndamento = tentativas.find((tentativa) => tentativa.status === 'em_andamento');
    const melhorResultado = concluidas.reduce(
        (melhor, tentativa) => Math.max(melhor, tentativa.percentual),
        0
    );
    const respondidas = emAndamento?.respondidas || 0;
    const total = emAndamento?.totalQuestoes || 12;
    const percentual = total ? Math.round((respondidas / total) * 100) : 0;

    document.getElementById('total-concluidas').textContent = concluidas.length;
    document.getElementById('melhor-aproveitamento').textContent = concluidas.length
        ? `${melhorResultado.toLocaleString('pt-BR')}%`
        : '—';
    document.getElementById('questoes-respondidas').textContent = `${respondidas} / ${total}`;
    document.getElementById('percentual-progresso').textContent = `${percentual}%`;
    document.getElementById('barra-progresso').setAttribute('aria-valuenow', String(percentual));
    document.getElementById('barra-preenchida').style.width = `${percentual}%`;

    listaTentativas.replaceChildren(...tentativas.map(criarCartaoTentativa));
    document.getElementById('sem-historico').hidden = tentativas.length > 0;
    resumoProgresso.hidden = false;
    estadoProgresso.hidden = true;
}

// Consulta o histórico do candidato e exibe seus resultados persistidos.
async function carregarHistorico() {
    estadoProgresso.hidden = false;
    erroProgresso.hidden = true;
    estadoProgresso.textContent = 'Carregando seu histórico...';

    try {
        const { response, data } = await window.apiRequest('/assessments/attempts');
        if (!response.ok) {
            throw new Error(data.mensagem || 'Não foi possível carregar o histórico.');
        }

        renderizarHistorico(data.tentativas);
    } catch (error) {
        console.error('Erro ao carregar o histórico de avaliações:', error);
        estadoProgresso.hidden = true;
        erroProgresso.textContent = error.message;
        erroProgresso.hidden = false;
    }
}

// Cria ou retoma a tentativa aberta e direciona o candidato para a questão atual.
async function iniciarOuRetomarAvaliacao() {
    botaoIniciar.disabled = true;

    try {
        const { response, data } = await window.apiRequest('/assessments/attempts', {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error(data.mensagem || 'Não foi possível iniciar a avaliação.');
        }

        window.location.href = `questao.html?attemptId=${data.idTentativa}`;
    } catch (error) {
        console.error('Erro ao iniciar ou retomar a avaliação:', error);
        erroProgresso.textContent = error.message;
        erroProgresso.hidden = false;
        botaoIniciar.disabled = false;
    }
}

botaoIniciar.addEventListener('click', iniciarOuRetomarAvaliacao);
carregarHistorico();
