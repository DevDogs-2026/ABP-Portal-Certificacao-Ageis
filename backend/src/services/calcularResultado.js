const LIMITE_APROVACAO = 65;
const TOTAL_QUESTOES = 12;

// Valida a pontuação e determina o aproveitamento e a aprovação da tentativa.
function calcularResultados(acertos, totalQuestoes = TOTAL_QUESTOES) {

    if(!Number.isInteger(totalQuestoes) || totalQuestoes <= 0) {
        throw new Error('O total de questões deve ser um número inteiro positivo.');
    }
    if(!Number.isInteger(acertos) || acertos < 0 || acertos > totalQuestoes) {
        throw new Error('O número de acertos deve ser um número inteiro não negativo e não pode exceder o total de questões.');
    }


    const percentualAcertos = (acertos / totalQuestoes) * 100;
    
    return {
        totalQuestoes,
        acertos,
        percentual: Number(percentualAcertos.toFixed(2)),
        aprovado: percentualAcertos >= LIMITE_APROVACAO,
    };

}

module.exports = calcularResultados;
