ALTER TABLE public.aga_avaliacoes
ADD COLUMN IF NOT EXISTS final_local TEXT CHECK (
    final_local IN ('mooca', 'abrigo')
);

ALTER TABLE public.aga_avaliacoes
ADD COLUMN IF NOT EXISTS final_preenchedor TEXT;
