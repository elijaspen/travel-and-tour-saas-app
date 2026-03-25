-- Tour ↔ category junction.

CREATE TABLE public.tour_categories (
  tour_id uuid NOT NULL REFERENCES public.tours (id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories (id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  PRIMARY KEY (tour_id, category_id)
);

CREATE INDEX tour_categories_category_id_idx ON public.tour_categories (category_id);
