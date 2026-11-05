const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs'); // Biblioteca correta instalada no seu projeto

const app = express();
app.use(express.json()); // Middleware para ler JSON no corpo da requisição

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'nome_do_seu_banco', // Substitua pelo nome real do banco
  password: 'sua_senha_do_banco',     // Substitua pela senha real do banco
  port: 5432,
});

/**
 * Rota POST /api/candidatos
 * Registra um novo candidato validando duplicidade de CPF e criptografando a senha.
 */
app.post('/api/candidatos', async (req, res) => {
  try {
    const { cpf, nome_completo, email, senha } = req.body;

    // Validação simples de campos obrigatórios
    if (!cpf || !nome_completo || !email || !senha) {
      return res.status(400).json({ 
        erro: 'Requisição inválida', 
        detalhe: 'Todos os campos (cpf, nome_completo, email, senha) são obrigatórios.' 
      });
    }

    // Validação básica do formato do CPF (11 dígitos numéricos)
    const cpfRegex = /^[0-9]{11}$/;
    if (!cpfRegex.test(cpf)) {
      return res.status(400).json({ 
        erro: 'Formato inválido', 
        detalhe: 'O CPF deve conter exatamente 11 dígitos numéricos.' 
      });
    }

    // Criptografia da senha (nunca salvar em texto puro)
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Query parametrizada para evitar SQL Injection
    const queryText = `
      INSERT INTO usuario (cpf, nome_completo, email, senha) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, cpf, nome_completo, email;
    `;
    
    const values = [cpf, nome_completo, email, senhaHash];

    // Executa a inserção no banco de dados de forma segura
    const result = await pool.query(queryText, values);

    // Retorno de sucesso (201 Created)
    return res.status(201).json({
      mensagem: 'Candidato cadastrado com sucesso!',
      candidato: result.rows[0]
    });

  } catch (error) {
    // Tratamento específico para CPF duplicado (Violação da constraint UNIQUE no PostgreSQL = 23505)
    if (error.code === '23505') {
      return res.status(409).json({
        erro: 'Conflito de dados',
        detalhe: 'Já existe um usuário cadastrado com este CPF.'
      });
    }

    // Tratamento para outros erros internos do servidor
    console.error('Erro ao cadastrar candidato:', error);
    return res.status(500).json({
      erro: 'Erro interno no servidor',
      detalhe: 'Não foi possível concluir o cadastro devido a um erro inesperado.'
    });
  }
});

// Inicialização do servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});