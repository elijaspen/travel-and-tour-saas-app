CREATE TYPE public.user_role AS ENUM (
  'customer',
  'business_owner',
  'agent',
  'admin'
);

CREATE TYPE public.profile_status AS ENUM (
  'active',
  'suspended'
);

CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  full_name text NOT NULL,
  phone text,
  emergency_contact text,
  status public.profile_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

