const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

// Abre/fecha o menu no celular
hamburger.addEventListener('click', () => {
    const aberto = nav.classList.toggle('open');
    hamburger.classList.toggle('open', aberto);
    hamburger.setAttribute('aria-expanded', aberto);
});

// Header ganha fundo ao rolar a página
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Efeito de rolagem suave ao clicar no botão

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const alvo = document.querySelector(link.getAttribute('href'));
        if (!alvo) return;

        e.preventDefault();
        alvo.scrollIntoView({ behavior: 'smooth' });

    });
});


// ---------- Tópicos ----------
var botoes = document.querySelectorAll(".gatilho");
var itens = document.querySelectorAll(".item");

botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
        var item = botao.parentElement;
        var painel = item.querySelector(".painel");
        var estavaAberto = item.classList.contains("ativo");

        // fecha todos os tópicos
        itens.forEach(function (outro) {
            outro.classList.remove("ativo");
            outro.querySelector(".painel").style.maxHeight = null;
        });

        // se o que eu cliquei estava fechado, abre ele
        if (!estavaAberto) {
            item.classList.add("ativo");
            painel.style.maxHeight = painel.scrollHeight + "px";
        }
    });
});