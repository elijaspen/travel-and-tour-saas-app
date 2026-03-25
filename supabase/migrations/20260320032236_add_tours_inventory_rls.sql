alter table "public"."blackout_dates" enable row level security;

alter table "public"."categories" enable row level security;

alter table "public"."tour_categories" enable row level security;

alter table "public"."tour_itineraries" enable row level security;

alter table "public"."tour_photos" enable row level security;

alter table "public"."tour_prices" enable row level security;

alter table "public"."tours" enable row level security;


  create policy "Company owners and admins manage blackout dates"
  on "public"."blackout_dates"
  as permissive
  for all
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.tours t
     JOIN public.companies c ON ((c.id = t.company_id)))
  WHERE ((t.id = blackout_dates.tour_id) AND (c.owner_profile_id = auth.uid())))) OR public.is_admin()))
with check (((EXISTS ( SELECT 1
   FROM (public.tours t
     JOIN public.companies c ON ((c.id = t.company_id)))
  WHERE ((t.id = blackout_dates.tour_id) AND (c.owner_profile_id = auth.uid())))) OR public.is_admin()));



  create policy "Authenticated users can read categories"
  on "public"."categories"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Company owners and admins manage tour categories"
  on "public"."tour_categories"
  as permissive
  for all
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.tours t
     JOIN public.companies c ON ((c.id = t.company_id)))
  WHERE ((t.id = tour_categories.tour_id) AND (c.owner_profile_id = auth.uid())))) OR public.is_admin()))
with check (((EXISTS ( SELECT 1
   FROM (public.tours t
     JOIN public.companies c ON ((c.id = t.company_id)))
  WHERE ((t.id = tour_categories.tour_id) AND (c.owner_profile_id = auth.uid())))) OR public.is_admin()));



  create policy "Company owners and admins manage tour itineraries"
  on "public"."tour_itineraries"
  as permissive
  for all
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.tours t
     JOIN public.companies c ON ((c.id = t.company_id)))
  WHERE ((t.id = tour_itineraries.tour_id) AND (c.owner_profile_id = auth.uid())))) OR public.is_admin()))
with check (((EXISTS ( SELECT 1
   FROM (public.tours t
     JOIN public.companies c ON ((c.id = t.company_id)))
  WHERE ((t.id = tour_itineraries.tour_id) AND (c.owner_profile_id = auth.uid())))) OR public.is_admin()));



  create policy "Company owners and admins manage tour photos"
  on "public"."tour_photos"
  as permissive
  for all
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.tours t
     JOIN public.companies c ON ((c.id = t.company_id)))
  WHERE ((t.id = tour_photos.tour_id) AND (c.owner_profile_id = auth.uid())))) OR public.is_admin()))
with check (((EXISTS ( SELECT 1
   FROM (public.tours t
     JOIN public.companies c ON ((c.id = t.company_id)))
  WHERE ((t.id = tour_photos.tour_id) AND (c.owner_profile_id = auth.uid())))) OR public.is_admin()));



  create policy "Company owners and admins manage tour prices"
  on "public"."tour_prices"
  as permissive
  for all
  to authenticated
using (((EXISTS ( SELECT 1
   FROM (public.tours t
     JOIN public.companies c ON ((c.id = t.company_id)))
  WHERE ((t.id = tour_prices.tour_id) AND (c.owner_profile_id = auth.uid())))) OR public.is_admin()))
with check (((EXISTS ( SELECT 1
   FROM (public.tours t
     JOIN public.companies c ON ((c.id = t.company_id)))
  WHERE ((t.id = tour_prices.tour_id) AND (c.owner_profile_id = auth.uid())))) OR public.is_admin()));



  create policy "Company owners and admins manage tours"
  on "public"."tours"
  as permissive
  for all
  to authenticated
using (((EXISTS ( SELECT 1
   FROM public.companies c
  WHERE ((c.id = tours.company_id) AND (c.owner_profile_id = auth.uid())))) OR public.is_admin()))
with check (((EXISTS ( SELECT 1
   FROM public.companies c
  WHERE ((c.id = tours.company_id) AND (c.owner_profile_id = auth.uid())))) OR public.is_admin()));



