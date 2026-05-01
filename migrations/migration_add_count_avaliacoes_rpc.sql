CREATE OR REPLACE FUNCTION public.contar_avaliacoes_aga()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer FROM public.aga_avaliacoes;
$$;

GRANT EXECUTE ON FUNCTION public.contar_avaliacoes_aga() TO anon;
