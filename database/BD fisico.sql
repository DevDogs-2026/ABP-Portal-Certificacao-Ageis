-- Remoção das tabelas na ordem correta (evita conflitos de dependência)
DROP TABLE IF EXISTS resposta_candidato CASCADE;
DROP TABLE IF EXISTS alternativa CASCADE;
DROP TABLE IF EXISTS progresso CASCADE;
DROP TABLE IF EXISTS certificado CASCADE;
DROP TABLE IF EXISTS resultado CASCADE;
DROP TABLE IF EXISTS imagem_estudo CASCADE;
DROP TABLE IF EXISTS conteudo CASCADE;
DROP TABLE IF EXISTS questao CASCADE;
DROP TABLE IF EXISTS tentativa_certificacao CASCADE;
DROP TABLE IF EXISTS tema CASCADE;
DROP TABLE IF EXISTS certificacao CASCADE;
DROP TABLE IF EXISTS candidato CASCADE;

CREATE DATABASE IF NOT EXISTS db_dogschool;

-- Criação das tabelas independentes (sem chaves estrangeiras)

CREATE TABLE candidato (
    id_candidato SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL
);

CREATE TABLE certificacao (
    id_certificacao SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    carga_horaria INTEGER,
    ativa BOOLEAN DEFAULT TRUE
);

CREATE TABLE tema (
    id_tema SERIAL PRIMARY KEY,
    nome_tema VARCHAR(255) NOT NULL,
    descricao_tema TEXT
);


-- Criação das tabelas com dependências de nível 1

CREATE TABLE tentativa_certificacao (
    id_tentativa SERIAL PRIMARY KEY,
    id_certificacao INTEGER NOT NULL,
    id_candidato INTEGER NOT NULL,
    iniciada_em TIMESTAMP,
    concluida_em TIMESTAMP,
    status_tentativa VARCHAR(20),
    FOREIGN KEY (id_certificacao) REFERENCES certificacao(id_certificacao) ON DELETE CASCADE,
    FOREIGN KEY (id_candidato) REFERENCES candidato(id_candidato) ON DELETE CASCADE
);

CREATE TABLE questao (
    id_questao SERIAL PRIMARY KEY,
    id_tema INTEGER NOT NULL,
    enunciado TEXT NOT NULL,
    imagem_url VARCHAR(255),
    descricao_questao TEXT,
    FOREIGN KEY (id_tema) REFERENCES tema(id_tema) ON DELETE CASCADE
);

CREATE TABLE conteudo (
    id_conteudo SERIAL PRIMARY KEY,
    id_tema INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao_conteudo TEXT,
    url_recurso VARCHAR(255),
    FOREIGN KEY (id_tema) REFERENCES tema(id_tema) ON DELETE CASCADE
);

CREATE TABLE imagem_estudo (
    id_imagem SERIAL PRIMARY KEY,
    id_tema INTEGER NOT NULL,
    imagem_url VARCHAR(255) NOT NULL,
    descricao_imagem TEXT,
    FOREIGN KEY (id_tema) REFERENCES tema(id_tema) ON DELETE CASCADE
);


-- Criação das tabelas com dependências de nível 2 ou superior

CREATE TABLE resultado (
    id_resultado SERIAL PRIMARY KEY,
    id_tentativa INTEGER NOT NULL,
    total_acertos INTEGER,
    total_questoes INTEGER,
    aproveitamento_percentual DECIMAL(5,2),
    nota_final DECIMAL(5,2),
    data_conclusao TIMESTAMP,
    FOREIGN KEY (id_tentativa) REFERENCES tentativa_certificacao(id_tentativa) ON DELETE CASCADE
);

CREATE TABLE certificado (
    id_certificado SERIAL PRIMARY KEY,
    id_resultado INTEGER NOT NULL,
    data_emissao TIMESTAMP,
    codigo_validacao VARCHAR(255) UNIQUE,
    url_validacao VARCHAR(255),
    arquivo_url VARCHAR(255),
    FOREIGN KEY (id_resultado) REFERENCES resultado(id_resultado) ON DELETE CASCADE
);

CREATE TABLE progresso (
    id_progresso SERIAL PRIMARY KEY,
    id_questao_sorteada INTEGER,
    id_tema INTEGER NOT NULL,
    id_tentativa INTEGER NOT NULL,
    status_tema VARCHAR(20),
    iniciado_em TIMESTAMP,
    encerrado_em TIMESTAMP,
    FOREIGN KEY (id_tema) REFERENCES tema(id_tema) ON DELETE CASCADE,
    FOREIGN KEY (id_tentativa) REFERENCES tentativa_certificacao(id_tentativa) ON DELETE CASCADE
);

CREATE TABLE alternativa (
    id_alternativa SERIAL PRIMARY KEY,
    id_questao INTEGER NOT NULL,
    letra CHAR(1) NOT NULL,
    texto_alternativa TEXT NOT NULL,
    correta BOOLEAN NOT NULL,
    FOREIGN KEY (id_questao) REFERENCES questao(id_questao) ON DELETE CASCADE
);

CREATE TABLE resposta_candidato (
    id_resposta SERIAL PRIMARY KEY,
    id_alternativa_escolhida INTEGER NOT NULL,
    id_progresso INTEGER NOT NULL,
    inicio_questao TIMESTAMP,
    encerramento_questao TIMESTAMP,
    tempo_utilizado_segundos INTEGER,
    status_resposta VARCHAR(20),
    acertou BOOLEAN,
    FOREIGN KEY (id_alternativa_escolhida) REFERENCES alternativa(id_alternativa) ON DELETE CASCADE,
    FOREIGN KEY (id_progresso) REFERENCES progresso(id_progresso) ON DELETE CASCADE
);