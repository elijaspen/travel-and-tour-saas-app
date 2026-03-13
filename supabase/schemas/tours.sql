-- Tours / products offered by companies.

CREATE TABLE public.tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies (id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  itinerary text,
  inclusions text,
  exclusions text,
  duration_days integer,
  location text,
  base_price numeric(12, 2) NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  max_slots_per_date integer,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX tours_company_id_idx ON public.tours (company_id);
CREATE INDEX tours_is_active_idx ON public.tours (is_active);

CREATE TRIGGER trigger_tours_set_updated_at
  BEFORE UPDATE ON public.tours
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

