-- ÚLTIMA ETAPA. SOMENTE APÓS VALIDAR O NOVO BACKEND E A MIGRAÇÃO COMPLETA.
-- IMPORTANTE: verifique que nenhum backend antigo está ativo e que a senha/chave
-- das contas cifradas está devidamente armazenada em um cofre de segredos.
BEGIN;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM candidato
             WHERE cpf_cifrado IS NULL OR email_cifrado IS NULL
                OR cpf_indice IS NULL OR email_indice IS NULL) THEN
    RAISE EXCEPTION 'Existem registros sem criptografia; abortando limpeza.';
  END IF;
END $$;
ALTER TABLE candidato
  ALTER COLUMN cpf_cifrado SET NOT NULL,
  ALTER COLUMN email_cifrado SET NOT NULL,
  ALTER COLUMN cpf_indice SET NOT NULL,
  ALTER COLUMN email_indice SET NOT NULL;
ALTER TABLE candidato DROP COLUMN IF EXISTS cpf;
ALTER TABLE candidato DROP COLUMN IF EXISTS email;
COMMIT;
