/* ---------- Elementos ---------- */
const btn = document.getElementById("btn-confirma");
const contPausa = document.getElementById("cont-pausa");
const limiteTempo = document.getElementById("limite-tempo");
const header = document.getElementById("header");
const main = document.getElementById("main");
const tempoSpan = document.getElementById("tempo");

const alternativas = [
    document.getElementById("alternativa-a"),
    document.getElementById("alternativa-b"),
    document.getElementById("alternativa-c"),
    document.getElementById("alternativa-d"),
];

/* ---------- Cronômetro ---------- */
const TEMPO_TOTAL = 150; // segundos por questão
let tempoRestante = TEMPO_TOTAL;
let encerrada = false;   // true quando a questão já foi confirmada ou o tempo acabou

tempoSpan.textContent = tempoRestante + "s";

const cronometro = setInterval(() => {
    tempoRestante--;
    tempoSpan.textContent = tempoRestante + "s";

    if (tempoRestante <= 0) {
        clearInterval(cronometro);
        tempoEsgotado();
    }
}, 1000);

/* ---------- Tela: tempo esgotado ---------- */
function tempoEsgotado() {
    encerrada = true;

    // A questão é considerada incorreta automaticamente (regra da avaliação).
    // Quando você tiver o armazenamento das respostas, registre aqui.

    limiteTempo.classList.remove("limite__tempo_div_off");
    limiteTempo.classList.add("limite__tempo_div");
    header.classList.remove("header");
    header.classList.add("header__off");
    main.classList.add("desfoque");
    btn.classList.remove("main__botao");
    btn.classList.add("main__botao_off");
}

/* ---------- Selecionar alternativa ---------- */
function aprBtn() {
    btn.classList.remove("main__botao_off");
    btn.classList.add("main__botao");
}

alternativas.forEach((alt) => {
    alt.addEventListener("click", () => {
        if (encerrada) return;

        alternativas.forEach((outra) =>
            outra.classList.remove("main__alternativa_selecionada")
        );
        alt.classList.add("main__alternativa_selecionada");
        aprBtn();
    });
});

/* ---------- Confirmar: tela de Continuar / Pausar ---------- */
btn.addEventListener("click", () => {
  if (encerrada) return;
  encerrada = true;
  clearInterval(cronometro); // Para o cronômetro ao confirmar

  /* Encontra qual alternativa o usuário selecionou */
  const alternativaSelecionada = alternativas.find(alt => 
    alt.classList.contains("main__alternativa_selecionada")
  );

  const alternativaCorreta = document.getElementById("alternativa-b");

  if (alternativaSelecionada) {
    alternativaSelecionada.classList.remove("main__alternativa_selecionada");

    /* Valida se o usuário acertou ou errou e aplica as cores */
    if (alternativaSelecionada === alternativaCorreta) {
      alternativaSelecionada.classList.add("main__alternativa_certo");
    } else {
      alternativaSelecionada.classList.add("main__alternativa_errado");
      alternativaCorreta.classList.add("main__alternativa_certo"); // Mostra a certa
    }
  }

  /* Aguarda 6,5 segundos (5000 milissegundos) com feedback visual antes de abrir a tela de Pausa/Continuar */
  setTimeout(() => {
    contPausa.classList.remove("continuar__pausar_div_off");
    contPausa.classList.add("continuar__pausar_div");
    header.classList.remove("header");
    header.classList.add("header__off");
    main.classList.add("desfoque");
    btn.classList.remove("main__botao");
    btn.classList.add("main__botao_off");
  }, 5000); 
});


/* ---------- Botões das telas (a ação ainda vai ser implementada) ---------- */
// Tela "Acabou o Tempo"
document.getElementById("proxima-questao-tempo").addEventListener("click", () => {
    // TODO: ir para o próximo tema
});
document.getElementById("pausar-certificado-tempo").addEventListener("click", () => {
    // TODO: salvar e sair da avaliação
});

// Tela Continuar / Pausar
document.getElementById("proxima-questao").addEventListener("click", () => {
    // TODO: ir para o próximo tema
});
document.getElementById("pausar-certificado").addEventListener("click", () => {
    // TODO: salvar e sair da avaliação
});
