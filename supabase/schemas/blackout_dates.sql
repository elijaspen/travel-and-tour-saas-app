-- Dates when a tour is unavailable.

CREATE TABLE public.blackout_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours (id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  CONSTRAINT blackout_dates_range_chk CHECK (start_date <= end_date)
);

CREATE INDEX blackout_dates_tour_id_idx ON public.blackout_dates (tour_id);
