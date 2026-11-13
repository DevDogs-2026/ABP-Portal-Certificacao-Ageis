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


// Organiza os temas em uma lista lateral e preserva o texto original de cada módulo.
const secaoEstudo = document.querySelector(".estudo");
const acordeao = secaoEstudo.querySelector(".acordeao");
const itensTema = [...acordeao.querySelectorAll(".item")];
const barraLateral = document.createElement("aside");
const cabecalhoLateral = document.createElement("div");
const tituloLateral = document.createElement("h2");
const descricaoLateral = document.createElement("p");
const buscaTema = document.createElement("input");
const painelEstudo = document.createElement("section");
const mensagemSemResultados = document.createElement("p");
const artigosTema = [];
let indiceAtivo = 0;

secaoEstudo.classList.add("layout-estudo");
barraLateral.className = "lista-estudo";
cabecalhoLateral.className = "lista-estudo__cabecalho";
tituloLateral.className = "lista-estudo__titulo";
tituloLateral.textContent = "Módulos de estudo";
descricaoLateral.className = "lista-estudo__descricao";
descricaoLateral.textContent = "Escolha um tema para ver o conteúdo.";
buscaTema.className = "busca-tema";
buscaTema.type = "search";
buscaTema.placeholder = "Buscar tema...";
buscaTema.setAttribute("aria-label", "Buscar tema");
painelEstudo.className = "painel-estudo";
painelEstudo.setAttribute("aria-live", "polite");
painelEstudo.setAttribute("aria-atomic", "true");
mensagemSemResultados.className = "painel-estudo__vazio";
mensagemSemResultados.textContent = "Nenhum tema encontrado. Tente outra busca.";
mensagemSemResultados.hidden = true;

cabecalhoLateral.append(tituloLateral, descricaoLateral);
barraLateral.append(cabecalhoLateral, buscaTema, acordeao);
acordeao.classList.add("lista-modulos");
secaoEstudo.append(barraLateral, painelEstudo);

itensTema.forEach((item, indice) => {
    const botao = item.querySelector(".gatilho");
    const painelOriginal = item.querySelector(".painel");
    const texto = painelOriginal.querySelector(".texto-explicativo");
    const titulo = botao.textContent.trim();
    const artigo = document.createElement("article");
    const subtitulo = document.createElement("p");
    const cabecalho = document.createElement("h1");

    botao.type = "button";
    botao.id = `botao-tema-${indice + 1}`;
    botao.setAttribute("aria-controls", `conteudo-tema-${indice + 1}`);
    botao.setAttribute("aria-expanded", "false");
    botao.querySelector(".seta")?.remove();

    artigo.className = "conteudo-tema";
    artigo.id = `conteudo-tema-${indice + 1}`;
    artigo.setAttribute("aria-labelledby", `titulo-tema-${indice + 1}`);
    artigo.hidden = true;
    subtitulo.className = "painel-estudo__sobretitulo";
    subtitulo.textContent = `Módulo ${String(indice + 1).padStart(2, "0")}`;
    cabecalho.id = `titulo-tema-${indice + 1}`;
    cabecalho.textContent = titulo;
    artigo.append(subtitulo, cabecalho, texto);
    painelEstudo.append(artigo);
    artigosTema.push(artigo);

    painelOriginal.remove();
    item.classList.add("item-tema");
    botao.addEventListener("click", () => selecionarTema(indice));
});

const controlesNavegacao = document.createElement("div");
const botaoAnterior = document.createElement("button");
const botaoProximo = document.createElement("button");
controlesNavegacao.className = "barra-estudo";
botaoAnterior.type = "button";
botaoAnterior.textContent = "← Tema anterior";
botaoProximo.type = "button";
botaoProximo.textContent = "Próximo tema →";
botaoAnterior.addEventListener("click", () => navegarTemas(-1));
botaoProximo.addEventListener("click", () => navegarTemas(1));
controlesNavegacao.append(botaoAnterior, botaoProximo);
painelEstudo.append(mensagemSemResultados, controlesNavegacao);

function selecionarTema(indice) {
    if (indice < 0 || indice >= itensTema.length) return;

    indiceAtivo = indice;
    mensagemSemResultados.hidden = true;
    itensTema.forEach((item, posicao) => {
        const ativo = posicao === indice;
        item.classList.toggle("ativo", ativo);
        item.querySelector(".gatilho").setAttribute("aria-expanded", String(ativo));
        artigosTema[posicao].hidden = !ativo;
    });

    atualizarNavegacao();
}

function atualizarNavegacao() {
    const visiveis = itensTema
        .map((item, indice) => item.hidden ? -1 : indice)
        .filter((indice) => indice >= 0);
    const posicaoAtiva = visiveis.indexOf(indiceAtivo);

    botaoAnterior.disabled = posicaoAtiva <= 0;
    botaoProximo.disabled = posicaoAtiva < 0 || posicaoAtiva >= visiveis.length - 1;
}

function navegarTemas(direcao) {
    const visiveis = itensTema
        .map((item, indice) => item.hidden ? -1 : indice)
        .filter((indice) => indice >= 0);
    const posicaoAtiva = visiveis.indexOf(indiceAtivo);
    const proximaPosicao = posicaoAtiva + direcao;

    if (posicaoAtiva < 0 || proximaPosicao < 0 || proximaPosicao >= visiveis.length) return;
    selecionarTema(visiveis[proximaPosicao]);
}

buscaTema.addEventListener("input", () => {
    const consulta = buscaTema.value.trim().toLocaleLowerCase("pt-BR");

    itensTema.forEach((item) => {
        const titulo = item.querySelector(".gatilho").textContent.toLocaleLowerCase("pt-BR");
        item.hidden = !titulo.includes(consulta);
    });

    const primeiroVisivel = itensTema.findIndex((item) => !item.hidden);
    if (primeiroVisivel < 0) {
        artigosTema.forEach((artigo) => { artigo.hidden = true; });
        mensagemSemResultados.hidden = false;
        botaoAnterior.disabled = true;
        botaoProximo.disabled = true;
        return;
    }

    if (itensTema[indiceAtivo].hidden) {
        selecionarTema(primeiroVisivel);
    } else {
        atualizarNavegacao();
    }
});

selecionarTema(0);