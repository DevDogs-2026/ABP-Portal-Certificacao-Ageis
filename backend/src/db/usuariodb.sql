DROP TABLE IF EXISTS recuperar_senhas CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;


--1. Tabela de Usuários (Fluxo de Cadastro / POST /api/candidatos)
--------------------------------------------------------------------------------

CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    CONSTRAINT chk_cpf_formato CHECK (cpf ~ '^[0-9]{11}$'),
    nome_completo VARCHAR(80) NOT NULL,
    email VARCHAR(100) NOT NULL,
    -- O campo senha armazena o hash gerado por Argon2id ou bcrypt (ex: tamanho recomendado >= 60-255 caracteres)
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inserção de dados, Atenção: em produção, o campo 'senha' NUNCA deve receber texto puro.
-- O script abaixo simula hashes gerados via bcrypt/Argon2id)
INSERT INTO usuario (cpf, nome_completo, email, senha)
VALUES
('48511397809', 'Vitor Souza Leal', 'vitorleal202@gmail.com', '$2b$12$ExemploDeHashBcryptParaVitorGalo13UnicoSeguro1'),
('04851137809', 'Maria Oliveira Silva', 'maria.silva@email.com', '$2b$12$ExemploDeHashBcryptParaOutroUsuarioSeguro2');