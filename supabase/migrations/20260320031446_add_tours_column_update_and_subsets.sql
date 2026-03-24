create type "public"."tour_type" as enum ('on_demand', 'fixed_schedule');


  create table "public"."blackout_dates" (
    "id" uuid not null default gen_random_uuid(),
    "tour_id" uuid not null,
    "start_date" date not null,
    "end_date" date not null,
    "reason" text
      );



  create table "public"."categories" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text not null,
    "name" text not null,
    "is_active" boolean not null default true
      );



  create table "public"."tour_categories" (
    "tour_id" uuid not null,
    "category_id" uuid not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );



  create table "public"."tour_itineraries" (
    "id" uuid not null default gen_random_uuid(),
    "tour_id" uuid not null,
    "day_number" integer not null,
    "start_time" time without time zone,
    "title" text not null,
    "description" text,
    "image_url" text
      );



  create table "public"."tour_photos" (
    "id" uuid not null default gen_random_uuid(),
    "tour_id" uuid not null,
    "file_url" text not null,
    "sort_order" integer not null default 0
      );



  create table "public"."tour_prices" (
    "id" uuid not null default gen_random_uuid(),
    "tour_id" uuid not null,
    "currency" text not null,
    "min_pax" integer not null,
    "max_pax" integer,
    "amount" integer not null
      );


alter table "public"."tours" drop column "base_price";

alter table "public"."tours" drop column "itinerary";

alter table "public"."tours" drop column "location";

alter table "public"."tours" drop column "max_slots_per_date";

alter table "public"."tours" add column "address_line" text;

alter table "public"."tours" add column "city" text;

alter table "public"."tours" add column "country_code" text;

alter table "public"."tours" add column "default_capacity" integer;

alter table "public"."tours" add column "latitude" numeric(10,7);

alter table "public"."tours" add column "longitude" numeric(10,7);

alter table "public"."tours" add column "max_simultaneous_bookings" integer;

alter table "public"."tours" add column "place_id" text;

alter table "public"."tours" add column "postal_code" text;

alter table "public"."tours" add column "province_state" text;

alter table "public"."tours" add column "short_description" text;

alter table "public"."tours" add column "slug" text not null;

alter table "public"."tours" add column "tags" text[] not null default '{}'::text[];

alter table "public"."tours" add column "tour_type" public.tour_type not null default 'on_demand'::public.tour_type;

alter table "public"."tours" alter column "exclusions" set default '{}'::text[];

alter table "public"."tours" alter column "exclusions" set not null;

alter table "public"."tours" alter column "exclusions" set data type text[] using "exclusions"::text[];

alter table "public"."tours" alter column "inclusions" set default '{}'::text[];

alter table "public"."tours" alter column "inclusions" set not null;

alter table "public"."tours" alter column "inclusions" set data type text[] using "inclusions"::text[];

CREATE UNIQUE INDEX blackout_dates_pkey ON public.blackout_dates USING btree (id);

CREATE INDEX blackout_dates_tour_id_idx ON public.blackout_dates USING btree (tour_id);

CREATE INDEX categories_is_active_idx ON public.categories USING btree (is_active);

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);

CREATE INDEX tour_categories_category_id_idx ON public.tour_categories USING btree (category_id);

CREATE UNIQUE INDEX tour_categories_pkey ON public.tour_categories USING btree (tour_id, category_id);

CREATE UNIQUE INDEX tour_itineraries_pkey ON public.tour_itineraries USING btree (id);

CREATE UNIQUE INDEX tour_itineraries_tour_id_day_number_key ON public.tour_itineraries USING btree (tour_id, day_number);

CREATE INDEX tour_itineraries_tour_id_idx ON public.tour_itineraries USING btree (tour_id);

CREATE UNIQUE INDEX tour_photos_pkey ON public.tour_photos USING btree (id);

CREATE INDEX tour_photos_tour_id_sort_order_idx ON public.tour_photos USING btree (tour_id, sort_order);

CREATE UNIQUE INDEX tour_prices_pkey ON public.tour_prices USING btree (id);

CREATE INDEX tour_prices_tour_id_idx ON public.tour_prices USING btree (tour_id);

CREATE UNIQUE INDEX tours_company_id_slug_key ON public.tours USING btree (company_id, slug);

alter table "public"."blackout_dates" add constraint "blackout_dates_pkey" PRIMARY KEY using index "blackout_dates_pkey";

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."tour_categories" add constraint "tour_categories_pkey" PRIMARY KEY using index "tour_categories_pkey";

alter table "public"."tour_itineraries" add constraint "tour_itineraries_pkey" PRIMARY KEY using index "tour_itineraries_pkey";

alter table "public"."tour_photos" add constraint "tour_photos_pkey" PRIMARY KEY using index "tour_photos_pkey";

alter table "public"."tour_prices" add constraint "tour_prices_pkey" PRIMARY KEY using index "tour_prices_pkey";

alter table "public"."blackout_dates" add constraint "blackout_dates_range_chk" CHECK ((start_date <= end_date)) not valid;

alter table "public"."blackout_dates" validate constraint "blackout_dates_range_chk";

alter table "public"."blackout_dates" add constraint "blackout_dates_tour_id_fkey" FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE not valid;

alter table "public"."blackout_dates" validate constraint "blackout_dates_tour_id_fkey";

alter table "public"."categories" add constraint "categories_slug_key" UNIQUE using index "categories_slug_key";

alter table "public"."tour_categories" add constraint "tour_categories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT not valid;

alter table "public"."tour_categories" validate constraint "tour_categories_category_id_fkey";

alter table "public"."tour_categories" add constraint "tour_categories_tour_id_fkey" FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE not valid;

alter table "public"."tour_categories" validate constraint "tour_categories_tour_id_fkey";

alter table "public"."tour_itineraries" add constraint "tour_itineraries_day_number_positive_chk" CHECK ((day_number > 0)) not valid;

alter table "public"."tour_itineraries" validate constraint "tour_itineraries_day_number_positive_chk";

alter table "public"."tour_itineraries" add constraint "tour_itineraries_tour_id_day_number_key" UNIQUE using index "tour_itineraries_tour_id_day_number_key";

alter table "public"."tour_itineraries" add constraint "tour_itineraries_tour_id_fkey" FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE not valid;

alter table "public"."tour_itineraries" validate constraint "tour_itineraries_tour_id_fkey";

alter table "public"."tour_photos" add constraint "tour_photos_tour_id_fkey" FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE not valid;

alter table "public"."tour_photos" validate constraint "tour_photos_tour_id_fkey";

alter table "public"."tour_prices" add constraint "tour_prices_amount_non_negative_chk" CHECK ((amount >= 0)) not valid;

alter table "public"."tour_prices" validate constraint "tour_prices_amount_non_negative_chk";

alter table "public"."tour_prices" add constraint "tour_prices_max_pax_vs_min_chk" CHECK (((max_pax IS NULL) OR (max_pax >= min_pax))) not valid;

alter table "public"."tour_prices" validate constraint "tour_prices_max_pax_vs_min_chk";

alter table "public"."tour_prices" add constraint "tour_prices_min_pax_positive_chk" CHECK ((min_pax > 0)) not valid;

alter table "public"."tour_prices" validate constraint "tour_prices_min_pax_positive_chk";

alter table "public"."tour_prices" add constraint "tour_prices_tour_id_fkey" FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE not valid;

alter table "public"."tour_prices" validate constraint "tour_prices_tour_id_fkey";

alter table "public"."tours" add constraint "tours_company_id_slug_key" UNIQUE using index "tours_company_id_slug_key";

alter table "public"."tours" add constraint "tours_default_capacity_positive_chk" CHECK (((default_capacity IS NULL) OR (default_capacity > 0))) not valid;

alter table "public"."tours" validate constraint "tours_default_capacity_positive_chk";

alter table "public"."tours" add constraint "tours_duration_days_positive_chk" CHECK (((duration_days IS NULL) OR (duration_days > 0))) not valid;

alter table "public"."tours" validate constraint "tours_duration_days_positive_chk";

alter table "public"."tours" add constraint "tours_max_simultaneous_bookings_positive_chk" CHECK (((max_simultaneous_bookings IS NULL) OR (max_simultaneous_bookings > 0))) not valid;

alter table "public"."tours" validate constraint "tours_max_simultaneous_bookings_positive_chk";

grant delete on table "public"."blackout_dates" to "anon";

grant insert on table "public"."blackout_dates" to "anon";

grant references on table "public"."blackout_dates" to "anon";

grant select on table "public"."blackout_dates" to "anon";

grant trigger on table "public"."blackout_dates" to "anon";

grant truncate on table "public"."blackout_dates" to "anon";

grant update on table "public"."blackout_dates" to "anon";

grant delete on table "public"."blackout_dates" to "authenticated";

grant insert on table "public"."blackout_dates" to "authenticated";

grant references on table "public"."blackout_dates" to "authenticated";

grant select on table "public"."blackout_dates" to "authenticated";

grant trigger on table "public"."blackout_dates" to "authenticated";

grant truncate on table "public"."blackout_dates" to "authenticated";

grant update on table "public"."blackout_dates" to "authenticated";

grant delete on table "public"."blackout_dates" to "service_role";

grant insert on table "public"."blackout_dates" to "service_role";

grant references on table "public"."blackout_dates" to "service_role";

grant select on table "public"."blackout_dates" to "service_role";

grant trigger on table "public"."blackout_dates" to "service_role";

grant truncate on table "public"."blackout_dates" to "service_role";

grant update on table "public"."blackout_dates" to "service_role";

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

grant delete on table "public"."tour_categories" to "anon";

grant insert on table "public"."tour_categories" to "anon";

grant references on table "public"."tour_categories" to "anon";

grant select on table "public"."tour_categories" to "anon";

grant trigger on table "public"."tour_categories" to "anon";

grant truncate on table "public"."tour_categories" to "anon";

grant update on table "public"."tour_categories" to "anon";

grant delete on table "public"."tour_categories" to "authenticated";

grant insert on table "public"."tour_categories" to "authenticated";

grant references on table "public"."tour_categories" to "authenticated";

grant select on table "public"."tour_categories" to "authenticated";

grant trigger on table "public"."tour_categories" to "authenticated";

grant truncate on table "public"."tour_categories" to "authenticated";

grant update on table "public"."tour_categories" to "authenticated";

grant delete on table "public"."tour_categories" to "service_role";

grant insert on table "public"."tour_categories" to "service_role";

grant references on table "public"."tour_categories" to "service_role";

grant select on table "public"."tour_categories" to "service_role";

grant trigger on table "public"."tour_categories" to "service_role";

grant truncate on table "public"."tour_categories" to "service_role";

grant update on table "public"."tour_categories" to "service_role";

grant delete on table "public"."tour_itineraries" to "anon";

grant insert on table "public"."tour_itineraries" to "anon";

grant references on table "public"."tour_itineraries" to "anon";

grant select on table "public"."tour_itineraries" to "anon";

grant trigger on table "public"."tour_itineraries" to "anon";

grant truncate on table "public"."tour_itineraries" to "anon";

grant update on table "public"."tour_itineraries" to "anon";

grant delete on table "public"."tour_itineraries" to "authenticated";

grant insert on table "public"."tour_itineraries" to "authenticated";

grant references on table "public"."tour_itineraries" to "authenticated";

grant select on table "public"."tour_itineraries" to "authenticated";

grant trigger on table "public"."tour_itineraries" to "authenticated";

grant truncate on table "public"."tour_itineraries" to "authenticated";

grant update on table "public"."tour_itineraries" to "authenticated";

grant delete on table "public"."tour_itineraries" to "service_role";

grant insert on table "public"."tour_itineraries" to "service_role";

grant references on table "public"."tour_itineraries" to "service_role";

grant select on table "public"."tour_itineraries" to "service_role";

grant trigger on table "public"."tour_itineraries" to "service_role";

grant truncate on table "public"."tour_itineraries" to "service_role";

grant update on table "public"."tour_itineraries" to "service_role";

grant delete on table "public"."tour_photos" to "anon";

grant insert on table "public"."tour_photos" to "anon";

grant references on table "public"."tour_photos" to "anon";

grant select on table "public"."tour_photos" to "anon";

grant trigger on table "public"."tour_photos" to "anon";

grant truncate on table "public"."tour_photos" to "anon";

grant update on table "public"."tour_photos" to "anon";

grant delete on table "public"."tour_photos" to "authenticated";

grant insert on table "public"."tour_photos" to "authenticated";

grant references on table "public"."tour_photos" to "authenticated";

grant select on table "public"."tour_photos" to "authenticated";

grant trigger on table "public"."tour_photos" to "authenticated";

grant truncate on table "public"."tour_photos" to "authenticated";

grant update on table "public"."tour_photos" to "authenticated";

grant delete on table "public"."tour_photos" to "service_role";

grant insert on table "public"."tour_photos" to "service_role";

grant references on table "public"."tour_photos" to "service_role";

grant select on table "public"."tour_photos" to "service_role";

grant trigger on table "public"."tour_photos" to "service_role";

grant truncate on table "public"."tour_photos" to "service_role";

grant update on table "public"."tour_photos" to "service_role";

grant delete on table "public"."tour_prices" to "anon";

grant insert on table "public"."tour_prices" to "anon";

grant references on table "public"."tour_prices" to "anon";

grant select on table "public"."tour_prices" to "anon";

grant trigger on table "public"."tour_prices" to "anon";

grant truncate on table "public"."tour_prices" to "anon";

grant update on table "public"."tour_prices" to "anon";

grant delete on table "public"."tour_prices" to "authenticated";

grant insert on table "public"."tour_prices" to "authenticated";

grant references on table "public"."tour_prices" to "authenticated";

grant select on table "public"."tour_prices" to "authenticated";

grant trigger on table "public"."tour_prices" to "authenticated";

grant truncate on table "public"."tour_prices" to "authenticated";

grant update on table "public"."tour_prices" to "authenticated";

grant delete on table "public"."tour_prices" to "service_role";

grant insert on table "public"."tour_prices" to "service_role";

grant references on table "public"."tour_prices" to "service_role";

grant select on table "public"."tour_prices" to "service_role";

grant trigger on table "public"."tour_prices" to "service_role";

grant truncate on table "public"."tour_prices" to "service_role";

grant update on table "public"."tour_prices" to "service_role";


