-- Day-by-day tour timeline.

CREATE TABLE public.tour_itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours (id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  start_time time without time zone,
  title text NOT NULL,
  description text,
  image_url text,
  CONSTRAINT tour_itineraries_tour_id_day_number_key UNIQUE (tour_id, day_number),
  CONSTRAINT tour_itineraries_day_number_positive_chk CHECK (day_number > 0)
);

CREATE INDEX tour_itineraries_tour_id_idx ON public.tour_itineraries (tour_id);
