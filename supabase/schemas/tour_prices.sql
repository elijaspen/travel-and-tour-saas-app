-- Tiered pricing (amount in smallest currency unit, e.g. cents).

CREATE TABLE public.tour_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours (id) ON DELETE CASCADE,
  currency text NOT NULL,
  min_pax integer NOT NULL,
  max_pax integer,
  amount integer NOT NULL,
  CONSTRAINT tour_prices_min_pax_positive_chk CHECK (min_pax > 0),
  CONSTRAINT tour_prices_max_pax_vs_min_chk
    CHECK (max_pax IS NULL OR max_pax >= min_pax),
  CONSTRAINT tour_prices_amount_non_negative_chk CHECK (amount >= 0)
);

CREATE INDEX tour_prices_tour_id_idx ON public.tour_prices (tour_id);
