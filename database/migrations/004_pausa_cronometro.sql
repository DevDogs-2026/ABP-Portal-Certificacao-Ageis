-- Execute uma vez ANTES de reiniciar o backend com a correção.
-- Idempotente: reaplicar não reativa questões que já estiverem pausadas.
BEGIN;
ALTER TABLE progresso
    ADD COLUMN IF NOT EXISTS tempo_acumulado_segundos INTEGER NOT NULL DEFAULT 0;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'progresso'
          AND column_name = 'cronometro_iniciado_em'
    ) THEN
        ALTER TABLE progresso ADD COLUMN cronometro_iniciado_em TIMESTAMP;
        -- Preserva o tempo já decorrido de avaliações em andamento.
        UPDATE progresso
           SET cronometro_iniciado_em = iniciado_em
         WHERE iniciado_em IS NOT NULL AND encerrado_em IS NULL;
    END IF;
END
$$;
COMMIT;
