const { randomBytes, createHash } = require('node:crypto');

function criarTokenRedefinicao() {
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256')
        .update(token, 'utf8')
        .digest('hex');

    return { token, tokenHash };
}

module.exports = { criarTokenRedefinicao };
