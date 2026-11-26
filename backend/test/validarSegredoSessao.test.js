const assert = require('node:assert/strict');
const { test } = require('node:test');
const validarSegredoSessao = require('../src/services/validarSegredoSessao');

test('rejeita segredo ausente ou curto', () => {
    assert.equal(validarSegredoSessao(undefined), false);
    assert.equal(validarSegredoSessao('segredo-curto'), false);
});

test('rejeita valores de exemplo mesmo que sejam longos', () => {
    assert.equal(
        validarSegredoSessao('replace-with-a-long-random-secret-value'),
        false,
    );
});

test('aceita segredo longo sem marcador de exemplo', () => {
    assert.equal(validarSegredoSessao('a'.repeat(64)), true);
});
