-- Post-trip reviews linked to bookings and tours.

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings (id) ON DELETE CASCADE,
  tour_id uuid NOT NULL REFERENCES public.tours (id) ON DELETE CASCADE,
  customer_profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE RESTRICT,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX reviews_tour_id_idx ON public.reviews (tour_id);
CREATE INDEX reviews_customer_profile_id_idx ON public.reviews (customer_profile_id);

CREATE TRIGGER trigger_reviews_set_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

