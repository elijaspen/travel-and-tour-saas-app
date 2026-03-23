-- Tour gallery images.

CREATE TABLE public.tour_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours (id) ON DELETE CASCADE,
  file_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE INDEX tour_photos_tour_id_sort_order_idx ON public.tour_photos (tour_id, sort_order);
