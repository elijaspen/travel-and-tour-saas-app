-- Bookings linking customers to tours on a given date.

CREATE TYPE public.booking_status AS ENUM (
  'pending_payment',
  'confirmed',
  'completed',
  'cancelled',
  'cancellation_requested'
);

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours (id) ON DELETE RESTRICT,
  customer_profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE RESTRICT,
  travel_date date NOT NULL,
  participant_count integer NOT NULL CHECK (participant_count > 0),
  total_price numeric(12, 2) NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending_payment',
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX bookings_tour_id_idx ON public.bookings (tour_id);
CREATE INDEX bookings_customer_profile_id_idx ON public.bookings (customer_profile_id);
CREATE INDEX bookings_travel_date_idx ON public.bookings (travel_date);

CREATE TRIGGER trigger_bookings_set_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_updated_at();

