const pool = require('./pool');

// Persiste o candidato na mesma tabela utilizada pelo login e pelas demais
// funcionalidades do portal. Todos os valores sÃ£o enviados como parÃ¢metros.
async function criarCandidato({ cpf, nome_completo, email, senhaHash }) {
  const sql = `
    INSERT INTO candidato (cpf, nome_completo, email, senha_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING id_candidato, cpf, nome_completo, email;
  `;
  const valores = [cpf, nome_completo, email, senhaHash];
  const resultado = await pool.query(sql, valores);
  return resultado.rows[0];
}

module.exports = { criarCandidato };
