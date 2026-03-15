create type "public"."booking_status" as enum ('pending_payment', 'confirmed', 'completed', 'cancelled', 'cancellation_requested');

create type "public"."company_status" as enum ('pending', 'approved', 'declined', 'suspended');


  create table "public"."bookings" (
    "id" uuid not null default gen_random_uuid(),
    "tour_id" uuid not null,
    "customer_profile_id" uuid not null,
    "travel_date" date not null,
    "participant_count" integer not null,
    "total_price" numeric(12,2) not null,
    "status" public.booking_status not null default 'pending_payment'::public.booking_status,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );



  create table "public"."companies" (
    "id" uuid not null default gen_random_uuid(),
    "owner_profile_id" uuid not null,
    "name" text not null,
    "description" text,
    "location" text,
    "contact_email" text,
    "contact_phone" text,
    "website_url" text,
    "status" public.company_status not null default 'pending'::public.company_status,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );



  create table "public"."reviews" (
    "id" uuid not null default gen_random_uuid(),
    "booking_id" uuid not null,
    "tour_id" uuid not null,
    "customer_profile_id" uuid not null,
    "rating" integer not null,
    "comment" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );



  create table "public"."tours" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid not null,
    "title" text not null,
    "description" text not null,
    "itinerary" text,
    "inclusions" text,
    "exclusions" text,
    "duration_days" integer,
    "location" text,
    "base_price" numeric(12,2) not null,
    "is_active" boolean not null default true,
    "max_slots_per_date" integer,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


CREATE INDEX bookings_customer_profile_id_idx ON public.bookings USING btree (customer_profile_id);

CREATE UNIQUE INDEX bookings_pkey ON public.bookings USING btree (id);

CREATE INDEX bookings_tour_id_idx ON public.bookings USING btree (tour_id);

CREATE INDEX bookings_travel_date_idx ON public.bookings USING btree (travel_date);

CREATE INDEX companies_owner_profile_id_idx ON public.companies USING btree (owner_profile_id);

CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id);

CREATE INDEX reviews_customer_profile_id_idx ON public.reviews USING btree (customer_profile_id);

CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id);

CREATE INDEX reviews_tour_id_idx ON public.reviews USING btree (tour_id);

CREATE INDEX tours_company_id_idx ON public.tours USING btree (company_id);

CREATE INDEX tours_is_active_idx ON public.tours USING btree (is_active);

CREATE UNIQUE INDEX tours_pkey ON public.tours USING btree (id);

alter table "public"."bookings" add constraint "bookings_pkey" PRIMARY KEY using index "bookings_pkey";

alter table "public"."companies" add constraint "companies_pkey" PRIMARY KEY using index "companies_pkey";

alter table "public"."reviews" add constraint "reviews_pkey" PRIMARY KEY using index "reviews_pkey";

alter table "public"."tours" add constraint "tours_pkey" PRIMARY KEY using index "tours_pkey";

alter table "public"."bookings" add constraint "bookings_customer_profile_id_fkey" FOREIGN KEY (customer_profile_id) REFERENCES public.profiles(id) ON DELETE RESTRICT not valid;

alter table "public"."bookings" validate constraint "bookings_customer_profile_id_fkey";

alter table "public"."bookings" add constraint "bookings_participant_count_check" CHECK ((participant_count > 0)) not valid;

alter table "public"."bookings" validate constraint "bookings_participant_count_check";

alter table "public"."bookings" add constraint "bookings_tour_id_fkey" FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE RESTRICT not valid;

alter table "public"."bookings" validate constraint "bookings_tour_id_fkey";

alter table "public"."companies" add constraint "companies_owner_profile_id_fkey" FOREIGN KEY (owner_profile_id) REFERENCES public.profiles(id) ON DELETE RESTRICT not valid;

alter table "public"."companies" validate constraint "companies_owner_profile_id_fkey";

alter table "public"."reviews" add constraint "reviews_booking_id_fkey" FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_booking_id_fkey";

alter table "public"."reviews" add constraint "reviews_customer_profile_id_fkey" FOREIGN KEY (customer_profile_id) REFERENCES public.profiles(id) ON DELETE RESTRICT not valid;

alter table "public"."reviews" validate constraint "reviews_customer_profile_id_fkey";

alter table "public"."reviews" add constraint "reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_rating_check";

alter table "public"."reviews" add constraint "reviews_tour_id_fkey" FOREIGN KEY (tour_id) REFERENCES public.tours(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_tour_id_fkey";

alter table "public"."tours" add constraint "tours_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE not valid;

alter table "public"."tours" validate constraint "tours_company_id_fkey";

grant delete on table "public"."bookings" to "anon";

grant insert on table "public"."bookings" to "anon";

grant references on table "public"."bookings" to "anon";

grant select on table "public"."bookings" to "anon";

grant trigger on table "public"."bookings" to "anon";

grant truncate on table "public"."bookings" to "anon";

grant update on table "public"."bookings" to "anon";

grant delete on table "public"."bookings" to "authenticated";

grant insert on table "public"."bookings" to "authenticated";

grant references on table "public"."bookings" to "authenticated";

grant select on table "public"."bookings" to "authenticated";

grant trigger on table "public"."bookings" to "authenticated";

grant truncate on table "public"."bookings" to "authenticated";

grant update on table "public"."bookings" to "authenticated";

grant delete on table "public"."bookings" to "service_role";

grant insert on table "public"."bookings" to "service_role";

grant references on table "public"."bookings" to "service_role";

grant select on table "public"."bookings" to "service_role";

grant trigger on table "public"."bookings" to "service_role";

grant truncate on table "public"."bookings" to "service_role";

grant update on table "public"."bookings" to "service_role";

grant delete on table "public"."companies" to "anon";

grant insert on table "public"."companies" to "anon";

grant references on table "public"."companies" to "anon";

grant select on table "public"."companies" to "anon";

grant trigger on table "public"."companies" to "anon";

grant truncate on table "public"."companies" to "anon";

grant update on table "public"."companies" to "anon";

grant delete on table "public"."companies" to "authenticated";

grant insert on table "public"."companies" to "authenticated";

grant references on table "public"."companies" to "authenticated";

grant select on table "public"."companies" to "authenticated";

grant trigger on table "public"."companies" to "authenticated";

grant truncate on table "public"."companies" to "authenticated";

grant update on table "public"."companies" to "authenticated";

grant delete on table "public"."companies" to "service_role";

grant insert on table "public"."companies" to "service_role";

grant references on table "public"."companies" to "service_role";

grant select on table "public"."companies" to "service_role";

grant trigger on table "public"."companies" to "service_role";

grant truncate on table "public"."companies" to "service_role";

grant update on table "public"."companies" to "service_role";

grant delete on table "public"."reviews" to "anon";

grant insert on table "public"."reviews" to "anon";

grant references on table "public"."reviews" to "anon";

grant select on table "public"."reviews" to "anon";

grant trigger on table "public"."reviews" to "anon";

grant truncate on table "public"."reviews" to "anon";

grant update on table "public"."reviews" to "anon";

grant delete on table "public"."reviews" to "authenticated";

grant insert on table "public"."reviews" to "authenticated";

grant references on table "public"."reviews" to "authenticated";

grant select on table "public"."reviews" to "authenticated";

grant trigger on table "public"."reviews" to "authenticated";

grant truncate on table "public"."reviews" to "authenticated";

grant update on table "public"."reviews" to "authenticated";

grant delete on table "public"."reviews" to "service_role";

grant insert on table "public"."reviews" to "service_role";

grant references on table "public"."reviews" to "service_role";

grant select on table "public"."reviews" to "service_role";

grant trigger on table "public"."reviews" to "service_role";

grant truncate on table "public"."reviews" to "service_role";

grant update on table "public"."reviews" to "service_role";

grant delete on table "public"."tours" to "anon";

grant insert on table "public"."tours" to "anon";

grant references on table "public"."tours" to "anon";

grant select on table "public"."tours" to "anon";

grant trigger on table "public"."tours" to "anon";

grant truncate on table "public"."tours" to "anon";

grant update on table "public"."tours" to "anon";

grant delete on table "public"."tours" to "authenticated";

grant insert on table "public"."tours" to "authenticated";

grant references on table "public"."tours" to "authenticated";

grant select on table "public"."tours" to "authenticated";

grant trigger on table "public"."tours" to "authenticated";

grant truncate on table "public"."tours" to "authenticated";

grant update on table "public"."tours" to "authenticated";

grant delete on table "public"."tours" to "service_role";

grant insert on table "public"."tours" to "service_role";

grant references on table "public"."tours" to "service_role";

grant select on table "public"."tours" to "service_role";

grant trigger on table "public"."tours" to "service_role";

grant truncate on table "public"."tours" to "service_role";

grant update on table "public"."tours" to "service_role";

CREATE TRIGGER trigger_bookings_set_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER trigger_companies_set_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER trigger_reviews_set_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE TRIGGER trigger_tours_set_updated_at BEFORE UPDATE ON public.tours FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


