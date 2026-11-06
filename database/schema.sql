CREATE TABLE IF NOT EXISTS candidato (
    id_candidato SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf CHAR(11) NOT NULL UNIQUE CHECK (cpf ~ '^[0-9]{11}$'),
    senha_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS certificacao (
    id_certificacao SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    carga_horaria INTEGER,
    ativa BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS tema (
    id_tema SERIAL PRIMARY KEY,
    nome_tema VARCHAR(255) NOT NULL UNIQUE,
    descricao_tema TEXT
);

CREATE TABLE IF NOT EXISTS questao (
    id_questao SERIAL PRIMARY KEY,
    id_tema INTEGER NOT NULL REFERENCES tema(id_tema) ON DELETE CASCADE,
    enunciado TEXT NOT NULL,
    imagem_url VARCHAR(255),
    descricao_questao TEXT,
    UNIQUE (id_tema, enunciado)
);

CREATE TABLE IF NOT EXISTS conteudo (
    id_conteudo SERIAL PRIMARY KEY,
    id_tema INTEGER NOT NULL REFERENCES tema(id_tema) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao_conteudo TEXT,
    url_recurso VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS imagem_estudo (
    id_imagem SERIAL PRIMARY KEY,
    id_tema INTEGER NOT NULL REFERENCES tema(id_tema) ON DELETE CASCADE,
    imagem_url VARCHAR(255) NOT NULL,
    descricao_imagem TEXT
);

CREATE TABLE IF NOT EXISTS alternativa (
    id_alternativa SERIAL PRIMARY KEY,
    id_questao INTEGER NOT NULL REFERENCES questao(id_questao) ON DELETE CASCADE,
    letra CHAR(1) NOT NULL CHECK (letra IN ('A', 'B', 'C', 'D')),
    texto_alternativa TEXT NOT NULL,
    correta BOOLEAN NOT NULL,
    UNIQUE (id_questao, letra)
);

CREATE TABLE IF NOT EXISTS tentativa_certificacao (
    id_tentativa SERIAL PRIMARY KEY,
    id_certificacao INTEGER NOT NULL REFERENCES certificacao(id_certificacao),
    id_candidato INTEGER NOT NULL REFERENCES candidato(id_candidato) ON DELETE CASCADE,
    iniciada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    concluida_em TIMESTAMP,
    status_tentativa VARCHAR(20) NOT NULL DEFAULT 'em_andamento'
        CHECK (status_tentativa IN ('em_andamento', 'concluida'))
);

CREATE TABLE IF NOT EXISTS progresso (
    id_progresso SERIAL PRIMARY KEY,
    id_questao_sorteada INTEGER NOT NULL REFERENCES questao(id_questao),
    id_tema INTEGER NOT NULL REFERENCES tema(id_tema),
    id_tentativa INTEGER NOT NULL REFERENCES tentativa_certificacao(id_tentativa) ON DELETE CASCADE,
    status_tema VARCHAR(20) NOT NULL DEFAULT 'pendente'
        CHECK (status_tema IN ('pendente', 'concluido')),
    iniciado_em TIMESTAMP,
    encerrado_em TIMESTAMP,
    UNIQUE (id_tentativa, id_tema)
);

CREATE TABLE IF NOT EXISTS resposta_candidato (
    id_resposta SERIAL PRIMARY KEY,
    id_alternativa_escolhida INTEGER REFERENCES alternativa(id_alternativa),
    id_progresso INTEGER NOT NULL UNIQUE REFERENCES progresso(id_progresso) ON DELETE CASCADE,
    inicio_questao TIMESTAMP NOT NULL,
    encerramento_questao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tempo_utilizado_segundos INTEGER NOT NULL CHECK (tempo_utilizado_segundos >= 0),
    status_resposta VARCHAR(20) NOT NULL CHECK (status_resposta IN ('respondida', 'tempo_esgotado')),
    acertou BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS resultado (
    id_resultado SERIAL PRIMARY KEY,
    id_tentativa INTEGER NOT NULL UNIQUE REFERENCES tentativa_certificacao(id_tentativa) ON DELETE CASCADE,
    total_acertos INTEGER NOT NULL CHECK (total_acertos >= 0),
    total_questoes INTEGER NOT NULL CHECK (total_questoes > 0),
    aproveitamento_percentual NUMERIC(5, 2) NOT NULL CHECK (
        aproveitamento_percentual >= 0 AND aproveitamento_percentual <= 100
    ),
    nota_final NUMERIC(5, 2) NOT NULL,
    data_conclusao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    aprovado BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS certificado (
    id_certificado SERIAL PRIMARY KEY,
    id_resultado INTEGER NOT NULL REFERENCES resultado(id_resultado) ON DELETE CASCADE,
    data_emissao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    codigo_validacao VARCHAR(255) NOT NULL UNIQUE,
    url_validacao VARCHAR(255),
    arquivo_url VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_tentativa_candidato_data
    ON tentativa_certificacao (id_candidato, iniciada_em DESC);

CREATE INDEX IF NOT EXISTS idx_progresso_tentativa
    ON progresso (id_tentativa);
