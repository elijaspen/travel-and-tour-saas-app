-- Companies / Businesses operating on the platform.

CREATE TYPE public.company_status AS ENUM (
  'pending',
  'approved',
  'declined',
  'suspended'
);

CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE RESTRICT,
  name text NOT NULL,
  description text,
  location text,
  contact_email text,
  contact_phone text,
  website_url text,
  status public.company_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX companies_owner_profile_id_idx ON public.companies (owner_profile_id);

CREATE TRIGGER trigger_companies_set_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE OR REPLACE FUNCTION public.get_company_status_counts()
RETURNS TABLE(status text, count bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT c.status::text, count(*)
  FROM public.companies c
  GROUP BY c.status;
$$;

