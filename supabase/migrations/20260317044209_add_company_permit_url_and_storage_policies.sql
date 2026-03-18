alter table "public"."companies" add column "permit_url" text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'company-permits',
  'company-permits',
  false,
  10485760,
  array['application/pdf', 'image/png', 'image/jpeg']
)
on conflict (id) do nothing;

create policy "Business owners can upload own permit files"
on storage.objects
as permissive
for insert
to authenticated
with check (
  bucket_id = 'company-permits'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'business_owner'
  )
);

create policy "Business owners can read own permit files"
on storage.objects
as permissive
for select
to authenticated
using (
  bucket_id = 'company-permits'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Admins can read permit files"
on storage.objects
as permissive
for select
to authenticated
using (
  bucket_id = 'company-permits'
  and public.is_admin()
);

