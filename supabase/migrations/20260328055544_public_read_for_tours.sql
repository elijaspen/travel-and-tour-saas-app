
  create policy "Public read active tours from approved companies"
  on "public"."tours"
  as permissive
  for select
  to anon, authenticated
using (((is_active = true) AND (EXISTS ( SELECT 1
   FROM public.companies c
  WHERE ((c.id = tours.company_id) AND (c.status = 'approved'::public.company_status))))));



