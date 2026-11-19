(function () {
    var CHAVE = 'usuarioLogado';     // mesma chave do sessao.js
    var PAGINA_LOGIN = 'acesso.html';

    // Esconde a página até confirmar o login (evita "piscar" o conteúdo)
    document.documentElement.style.visibility = 'hidden';

    var logado = false;
    try {
        logado = !!JSON.parse(localStorage.getItem(CHAVE));
    } catch (e) {}

    if (!logado) {
        // Guarda a página pedida para voltar depois do login
        var pagina = location.pathname.split('/').pop() || 'avaliacao.html';
        sessionStorage.setItem('voltarPara', pagina);
        location.replace(PAGINA_LOGIN);
    } else {
        document.documentElement.style.visibility = 'visible';
    }
})();