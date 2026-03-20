-- Tour taxonomy (listing / filters).

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);

CREATE INDEX categories_is_active_idx ON public.categories (is_active);
