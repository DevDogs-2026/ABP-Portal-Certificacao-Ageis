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