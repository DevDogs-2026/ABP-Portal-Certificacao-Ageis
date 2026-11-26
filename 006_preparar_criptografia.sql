-- ETAPA COMPATÍVEL: rode antes de publicar o backend que cifra os dados.
-- NÃO remove dados em texto claro e não reescreve registros antigos.
BEGIN;
ALTER TABLE candidato
  ADD COLUMN IF NOT EXISTS cpf_cifrado TEXT,
  ADD COLUMN IF NOT EXISTS email_cifrado TEXT,
  ADD COLUMN IF NOT EXISTS cpf_indice CHAR(64),
  ADD COLUMN IF NOT EXISTS email_indice CHAR(64);

-- Permite que a nova versão não armazene mais dados em texto claro.
-- A versão antiga continua funcionando até a troca de deploy.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_schema = current_schema() AND table_name = 'candidato' AND column_name = 'cpf') THEN
    ALTER TABLE candidato ALTER COLUMN cpf DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
      WHERE table_schema = current_schema() AND table_name = 'candidato' AND column_name = 'email') THEN
    ALTER TABLE candidato ALTER COLUMN email DROP NOT NULL;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_candidato_cpf_indice ON candidato (cpf_indice);
CREATE UNIQUE INDEX IF NOT EXISTS uq_candidato_email_indice ON candidato (email_indice);
COMMIT;
