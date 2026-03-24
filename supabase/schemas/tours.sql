-- Tours / products offered by companies (parent row).

CREATE TYPE public.tour_type AS ENUM ('on_demand', 'fixed_schedule');

CREATE TABLE public.tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  short_description text,
  description text NOT NULL,
  inclusions text[] NOT NULL DEFAULT '{}',
  exclusions text[] NOT NULL DEFAULT '{}',
  duration_days integer,
  default_capacity integer,
  max_simultaneous_bookings integer,
  tour_type public.tour_type NOT NULL DEFAULT 'on_demand',
  address_line text,
  city text,
  province_state text,
  country_code text,
  postal_code text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  place_id text,
  tags text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT tours_company_id_slug_key UNIQUE (company_id, slug),
  CONSTRAINT tours_default_capacity_positive_chk
    CHECK (default_capacity IS NULL OR default_capacity > 0),
  CONSTRAINT tours_max_simultaneous_bookings_positive_chk
    CHECK (max_simultaneous_bookings IS NULL OR max_simultaneous_bookings > 0),
  CONSTRAINT tours_duration_days_positive_chk
    CHECK (duration_days IS NULL OR duration_days > 0)
);

CREATE INDEX tours_company_id_idx ON public.tours (company_id);
CREATE INDEX tours_is_active_idx ON public.tours (is_active);

CREATE TRIGGER trigger_tours_set_updated_at
  BEFORE UPDATE ON public.tours
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();
