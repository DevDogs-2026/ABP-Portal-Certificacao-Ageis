const express = require("express");
const pool = require("../db/pool");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const certificacoes = await pool.query(`
            SELECT id_certificacao, titulo, descricao, carga_horaria
            FROM certificacao
            WHERE ativa = TRUE
            ORDER BY titulo
        `);

    const temas = await pool.query(`
            SELECT COUNT(*) AS total
            FROM tema
        `);

    const conteudos = await pool.query(`
            SELECT COUNT(*) AS total
            FROM conteudo
        `);

    return res.json({
      certificacoes: certificacoes.rows,
      totalTemas: Number(temas.rows[0].total),
      totalConteudos: Number(conteudos.rows[0].total),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
