create table "public"."user_saved_tours" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "tour_id" uuid not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);

-- indices & primary key
CREATE UNIQUE INDEX user_saved_tours_pkey ON public.user_saved_tours USING btree (id);
CREATE UNIQUE INDEX user_saved_tours_user_id_tour_id_key ON public.user_saved_tours USING btree (user_id, tour_id);
CREATE INDEX user_saved_tours_user_id_idx ON public.user_saved_tours USING btree (user_id);

alter table "public"."user_saved_tours" add constraint "user_saved_tours_pkey" PRIMARY KEY using index "user_saved_tours_pkey";
alter table "public"."user_saved_tours" add constraint "user_saved_tours_user_id_tour_id_key" UNIQUE using index "user_saved_tours_user_id_tour_id_key";

-- foreign key constraints
alter table "public"."user_saved_tours" add constraint "user_saved_tours_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "public"."user_saved_tours" validate constraint "user_saved_tours_user_id_fkey";

alter table "public"."user_saved_tours" add constraint "user_saved_tours_tour_id_fkey" FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE not valid;
alter table "public"."user_saved_tours" validate constraint "user_saved_tours_tour_id_fkey";

alter table "public"."user_saved_tours" enable row level security;

-- policies
create policy "Customers can read own saved tours"
on "public"."user_saved_tours"
as permissive
for select
to authenticated
using (
  (user_id = auth.uid()) AND (EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'customer'::public.user_role))))
);

create policy "Customers can save own tours"
on "public"."user_saved_tours"
as permissive
for insert
to authenticated
with check (
  (user_id = auth.uid()) AND (EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'customer'::public.user_role))))
);

create policy "Customers can delete own saved tours"
on "public"."user_saved_tours"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));

create policy "Admins can read all saved tours"
on "public"."user_saved_tours"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1 FROM public.profiles WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::public.user_role)))));

CREATE TRIGGER handle_user_saved_tours_updated_at BEFORE UPDATE ON public.user_saved_tours FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

grant delete, insert, references, select, trigger, truncate, update on table "public"."user_saved_tours" to "authenticated";
grant select on table "public"."user_saved_tours" to "service_role";