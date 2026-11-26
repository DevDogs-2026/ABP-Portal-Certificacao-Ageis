function validarSegredoSessao(segredo) {
    return typeof segredo === 'string' &&
        Buffer.byteLength(segredo, 'utf8') >= 32 &&
        !/(?:replace|change|example|placeholder)/i.test(segredo);
}

module.exports = validarSegredoSessao;
