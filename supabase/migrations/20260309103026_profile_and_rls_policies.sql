create extension if not exists "moddatetime" with schema "extensions";

create type "public"."profile_status" as enum ('active', 'suspended');

create type "public"."user_role" as enum ('customer', 'business_owner', 'agent', 'admin');


  create table "public"."profiles" (
    "id" uuid not null,
    "role" public.user_role not null,
    "full_name" text not null,
    "phone" text,
    "emergency_contact" text,
    "status" public.profile_status not null default 'active'::public.profile_status,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

create policy "Users can create own profile"
on "public"."profiles"
as permissive
for insert
to public
with check (((id = auth.uid()) AND (role = ANY (ARRAY['customer'::public.user_role, 'business_owner'::public.user_role]))));

create policy "Users can read own profile"
on "public"."profiles"
as permissive
for select
to public
using ((id = auth.uid()));

create policy "Users can update own profile"
on "public"."profiles"
as permissive
for update
to public
using ((id = auth.uid()))
with check ((id = auth.uid()));


CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');