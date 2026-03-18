set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$function$
;


  create policy "Admins can read all profiles"
  on "public"."profiles"
  as permissive
  for select
  to public
using (public.is_admin());



