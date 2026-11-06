ALTER TABLE resposta_candidato
    ALTER COLUMN id_alternativa_escolhida DROP NOT NULL;

ALTER TABLE resposta_candidato
    ADD COLUMN IF NOT EXISTS inicio_questao TIMESTAMP,
    ADD COLUMN IF NOT EXISTS encerramento_questao TIMESTAMP,
    ADD COLUMN IF NOT EXISTS tempo_utilizado_segundos INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS status_resposta VARCHAR(20) NOT NULL DEFAULT 'respondida',
    ADD COLUMN IF NOT EXISTS acertou BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE resultado
    ADD COLUMN IF NOT EXISTS aprovado BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE tentativa_certificacao
    ALTER COLUMN iniciada_em SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN status_tentativa SET DEFAULT 'em_andamento';

CREATE UNIQUE INDEX IF NOT EXISTS uq_certificacao_titulo
    ON certificacao (titulo);

CREATE UNIQUE INDEX IF NOT EXISTS uq_tema_nome
    ON tema (nome_tema);

CREATE UNIQUE INDEX IF NOT EXISTS uq_questao_tema_enunciado
    ON questao (id_tema, enunciado);

CREATE UNIQUE INDEX IF NOT EXISTS uq_alternativa_questao_letra
    ON alternativa (id_questao, letra);

CREATE UNIQUE INDEX IF NOT EXISTS uq_progresso_tentativa_tema
    ON progresso (id_tentativa, id_tema);

CREATE UNIQUE INDEX IF NOT EXISTS uq_resposta_progresso
    ON resposta_candidato (id_progresso);

CREATE UNIQUE INDEX IF NOT EXISTS uq_resultado_tentativa
    ON resultado (id_tentativa);

CREATE INDEX IF NOT EXISTS idx_tentativa_candidato_data
    ON tentativa_certificacao (id_candidato, iniciada_em DESC);

CREATE INDEX IF NOT EXISTS idx_progresso_tentativa
    ON progresso (id_tentativa);
