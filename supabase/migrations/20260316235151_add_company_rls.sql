alter table "public"."companies" enable row level security;


  create policy "Admins can read all companies"
  on "public"."companies"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role)))));



  create policy "Admins can update all companies"
  on "public"."companies"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role)))));



  create policy "Authenticated users can read approved companies"
  on "public"."companies"
  as permissive
  for select
  to public
using ((status = 'approved'::public.company_status));



  create policy "Business owners can create own company"
  on "public"."companies"
  as permissive
  for insert
  to public
with check (((owner_profile_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'business_owner'::public.user_role))))));



  create policy "Owner can read own company"
  on "public"."companies"
  as permissive
  for select
  to public
using ((owner_profile_id = auth.uid()));



  create policy "Owner can update own company"
  on "public"."companies"
  as permissive
  for update
  to public
using ((owner_profile_id = auth.uid()))
with check ((owner_profile_id = auth.uid()));



