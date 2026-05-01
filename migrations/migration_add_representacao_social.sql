ALTER TABLE public.aga_avaliacoes
ADD COLUMN IF NOT EXISTS representacao_saude_cidadania_propria TEXT;

ALTER TABLE public.aga_avaliacoes
ADD COLUMN IF NOT EXISTS representacao_saude_cidadania_outros TEXT;
