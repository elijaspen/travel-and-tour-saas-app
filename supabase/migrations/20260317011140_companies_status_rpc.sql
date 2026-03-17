set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_company_status_counts()
 RETURNS TABLE(status text, count bigint)
 LANGUAGE sql
 STABLE
AS $function$
  SELECT c.status::text, count(*)
  FROM public.companies c
  GROUP BY c.status;
$function$
;


