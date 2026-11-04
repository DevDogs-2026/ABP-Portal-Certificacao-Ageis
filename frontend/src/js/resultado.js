const situacao = document.getElementById('situacao');
const canvas = document.getElementById('confetes');
const contexto = canvas.getContext('2d');
const movimentoReduzido = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
);

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

soltarConfetes();