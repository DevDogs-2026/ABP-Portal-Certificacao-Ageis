const { test } = require('node:test');
const assert = require('node:assert');
const calcularResultados = require('../src/services/calcularResultado');


test('7 acertos em 12 questões deve retornar reprovado', () => {
    const resultado = calcularResultados(7, 12);

    assert.strictEqual(resultado.totalQuestoes, 12);
    assert.strictEqual(resultado.acertos, 7);
    assert.strictEqual(resultado.percentual, 58.33);
    assert.strictEqual(resultado.aprovado, false);
});

test('8 acertos em 12 questões deve retornar aprovado', () => {
    const resultado = calcularResultados(8, 12);

    assert.strictEqual(resultado.percentual, 66.67);
    assert.strictEqual(resultado.aprovado, true);
});

test (' rejeitar acertos maiores que o total de questões', () => {
    assert.throws(() =>  calcularResultados(13, 12));
});

test ('Rejeitar total de quesões igual a zero', () => {
    assert.throws(() =>  calcularResultados(0, 0));
});

test('usa 12 questões quando o total não é informado', () => {
    const resultado = calcularResultados(8);

    assert.strictEqual(resultado.totalQuestoes, 12);
    assert.strictEqual(resultado.aprovado, true);
});