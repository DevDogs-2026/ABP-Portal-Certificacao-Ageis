// Impede o acesso a rotas privadas quando a sessão não contém um candidato autenticado.
function exigirAutenticacao(req, res, next) {
    if(!req.session?.candidato) {
        return res.status(401).json({ mensagem: 'Não autorizado' });
    }
    req.candidato = req.session.candidato;
    next();
}

module.exports = exigirAutenticacao;