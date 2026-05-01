ALTER TABLE public.aga_medicamentos
DROP CONSTRAINT IF EXISTS aga_medicamentos_ordem_check;

ALTER TABLE public.aga_medicamentos
ADD CONSTRAINT aga_medicamentos_ordem_check CHECK (ordem >= 1);
