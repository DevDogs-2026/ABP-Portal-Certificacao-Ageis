const situacao = document.getElementById('situacao');
const canvas = document.getElementById('confetes');
const contexto = canvas.getContext('2d');
const movimentoReduzido = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
);

// Exibe a porcentagem com a convenção decimal do português brasileiro.
function formatarPercentual(percentual) {
    return `${percentual.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}%`;
}

// Atualiza os indicadores da página com o resultado confirmado pelo servidor.
function mostrarResultado(resultado) {
    const percentual = Math.min(100, Math.max(0, resultado.percentual));
    const erros = resultado.totalQuestoes - resultado.acertos;
    const aprovado = resultado.aprovado;
    const textoPercentual = formatarPercentual(percentual);

    document.getElementById('percentual').textContent = textoPercentual;
    document.getElementById('grafico-aproveitamento').style.setProperty(
        '--percentual',
        `${percentual}%`
    );
    document.getElementById('grafico-aproveitamento').setAttribute(
        'aria-label',
        `Aproveitamento: ${textoPercentual}`
    );
    document.getElementById('acertos').textContent = resultado.acertos;
    document.getElementById('erros').textContent = erros;
    document.getElementById('total-questoes').textContent = resultado.totalQuestoes;
    document.getElementById('texto-situacao').textContent =
        aprovado ? 'Aprovado' : 'Reprovado';
    document.getElementById('indicador-situacao').textContent =
        aprovado ? '✓' : '×';
    document.getElementById('mensagem-resultado').textContent = aprovado
        ? 'Parabéns! Você alcançou o aproveitamento necessário.'
        : 'Desta vez você não alcançou o mínimo de 65%. Você pode tentar novamente.';
    situacao.classList.add(aprovado ? 'resultado-aprovado' : 'resultado-reprovado');
    document.title = `${aprovado ? 'Aprovado' : 'Reprovado'} | Resultado da avaliação`;

    if (aprovado) soltarConfetes();
}

// Apresenta uma falha de carregamento sem mostrar dados de resultado fictícios.
function mostrarErro(mensagem) {
    document.getElementById('texto-situacao').textContent = 'Resultado indisponível';
    document.getElementById('indicador-situacao').textContent = '!';
    document.getElementById('mensagem-resultado').textContent = mensagem;
    document.getElementById('erro-resultado').textContent = mensagem;
    document.getElementById('erro-resultado').hidden = false;
}

// Carrega do backend o resultado da tentativa identificada na URL.
async function carregarResultado() {
    const idTentativa = new URLSearchParams(window.location.search).get('attemptId');
    if (!/^\d+$/.test(idTentativa || '')) {
        mostrarErro('Não foi possível identificar a tentativa. Acesse o resultado pelo histórico.');
        return;
    }

    try {
        const { response, data } = await window.apiRequest(
            `/assessments/attempts/${idTentativa}/result`
        );
        if (!response.ok) {
            throw new Error(data.mensagem || 'Não foi possível carregar o resultado.');
        }

        mostrarResultado(data.resultado);
    } catch (error) {
        console.error('Erro ao carregar o resultado da avaliação:', error);
        mostrarErro(error.message);
    }
}

// Anima confetes somente para candidatos aprovados e que não preferem movimento reduzido.
function soltarConfetes() {
    if (
        !situacao.classList.contains('resultado-aprovado') ||
        movimentoReduzido.matches
    ) {
        return;
    }

    const escala = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * escala;
    canvas.height = window.innerHeight * escala;
    contexto.scale(escala, escala);

    const cores = ['#3A66FF', '#8434e0', '#16804A', '#F4B942', '#E85D75'];
    const particulas = Array.from({ length: 120 }, () => ({
        x: Math.random() * window.innerWidth,
        y: -Math.random() * 120,
        tamanho: Math.random() * 8 + 4,
        velocidadeY: Math.random() * 4 + 4,
        velocidadeX: Math.random() * 2 - 1,
        rotacao: Math.random() * Math.PI,
        giro: Math.random() * 0.12 - 0.06,
        cor: cores[Math.floor(Math.random() * cores.length)],
    }));

    const inicio = performance.now();
    const duracao = 3500;

    // Desenha cada quadro da animação até o tempo configurado terminar.
    function animar(agora) {
        const decorrido = agora - inicio;
        contexto.clearRect(0, 0, window.innerWidth, window.innerHeight);

        particulas.forEach((particula) => {
            particula.x += particula.velocidadeX;
            particula.y += particula.velocidadeY;
            particula.rotacao += particula.giro;

            contexto.save();
            contexto.translate(particula.x, particula.y);
            contexto.rotate(particula.rotacao);
            contexto.fillStyle = particula.cor;
            contexto.fillRect(
                -particula.tamanho / 2,
                -particula.tamanho / 2,
                particula.tamanho,
                particula.tamanho * 0.65
            );
            contexto.restore();
        });

        if (decorrido < duracao) {
            requestAnimationFrame(animar);
        } else {
            contexto.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
    }

    requestAnimationFrame(animar);
}

carregarResultado();
