BEGIN;
CREATE TABLE IF NOT EXISTS recuperacao_senha (
  id_candidato INTEGER PRIMARY KEY REFERENCES candidato(id_candidato) ON DELETE CASCADE,
  token_hash CHAR(64) NOT NULL UNIQUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expira_em TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_recuperacao_senha_expira_em ON recuperacao_senha (expira_em);
COMMIT;
