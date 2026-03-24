-- ============================================================
-- profiles
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Users can create own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    id = auth.uid()
    AND role IN ('customer', 'business_owner')
  );

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================
-- companies
-- ============================================================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Owners can always read their own company regardless of status.
CREATE POLICY "Owner can read own company"
  ON public.companies
  FOR SELECT
  USING (owner_profile_id = auth.uid());

-- Approved companies are visible to all authenticated users (e.g. customers browsing).
CREATE POLICY "Authenticated users can read approved companies"
  ON public.companies
  FOR SELECT
  USING (status = 'approved');

-- Only business_owners may create a company, and only for themselves.
CREATE POLICY "Business owners can create own company"
  ON public.companies
  FOR INSERT
  WITH CHECK (
    owner_profile_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'business_owner'
    )
  );

-- Owners can update their own company details.
-- Status changes are intentionally excluded here — they must go through
-- the admin client (service role) which bypasses RLS.
CREATE POLICY "Owner can update own company"
  ON public.companies
  FOR UPDATE
  USING (owner_profile_id = auth.uid())
  WITH CHECK (owner_profile_id = auth.uid());

-- Admins have full read access across all companies.
CREATE POLICY "Admins can read all companies"
  ON public.companies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any company (includes status approvals/suspensions).
CREATE POLICY "Admins can update all companies"
  ON public.companies
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- categories (reference data for tour labels / embeds)
-- ============================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read categories"
  ON public.categories
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- tours
-- ============================================================

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company owners and admins manage tours"
  ON public.tours
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.companies c
      WHERE c.id = tours.company_id
        AND c.owner_profile_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.companies c
      WHERE c.id = tours.company_id
        AND c.owner_profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ============================================================
-- tour_photos
-- ============================================================

ALTER TABLE public.tour_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company owners and admins manage tour photos"
  ON public.tour_photos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tours t
      JOIN public.companies c ON c.id = t.company_id
      WHERE t.id = tour_photos.tour_id
        AND c.owner_profile_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.tours t
      JOIN public.companies c ON c.id = t.company_id
      WHERE t.id = tour_photos.tour_id
        AND c.owner_profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ============================================================
-- tour_categories
-- ============================================================

ALTER TABLE public.tour_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company owners and admins manage tour categories"
  ON public.tour_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tours t
      JOIN public.companies c ON c.id = t.company_id
      WHERE t.id = tour_categories.tour_id
        AND c.owner_profile_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.tours t
      JOIN public.companies c ON c.id = t.company_id
      WHERE t.id = tour_categories.tour_id
        AND c.owner_profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ============================================================
-- tour_prices
-- ============================================================

ALTER TABLE public.tour_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company owners and admins manage tour prices"
  ON public.tour_prices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tours t
      JOIN public.companies c ON c.id = t.company_id
      WHERE t.id = tour_prices.tour_id
        AND c.owner_profile_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.tours t
      JOIN public.companies c ON c.id = t.company_id
      WHERE t.id = tour_prices.tour_id
        AND c.owner_profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ============================================================
-- tour_itineraries
-- ============================================================

ALTER TABLE public.tour_itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company owners and admins manage tour itineraries"
  ON public.tour_itineraries
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tours t
      JOIN public.companies c ON c.id = t.company_id
      WHERE t.id = tour_itineraries.tour_id
        AND c.owner_profile_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.tours t
      JOIN public.companies c ON c.id = t.company_id
      WHERE t.id = tour_itineraries.tour_id
        AND c.owner_profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ============================================================
-- blackout_dates
-- ============================================================

ALTER TABLE public.blackout_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company owners and admins manage blackout dates"
  ON public.blackout_dates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tours t
      JOIN public.companies c ON c.id = t.company_id
      WHERE t.id = blackout_dates.tour_id
        AND c.owner_profile_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.tours t
      JOIN public.companies c ON c.id = t.company_id
      WHERE t.id = blackout_dates.tour_id
        AND c.owner_profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ============================================================
-- storage: company permits bucket + objects policies
-- (in declarative schema so db diff does not suggest DROP POLICY)
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-permits',
  'company-permits',
  false,
  10485760,
  ARRAY['application/pdf', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Business owners can upload own permit files"
  ON storage.objects
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'company-permits'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'business_owner'
    )
  );

CREATE POLICY "Business owners can read own permit files"
  ON storage.objects
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'company-permits'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admins can read permit files"
  ON storage.objects
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'company-permits'
    AND public.is_admin()
  );

-- ============================================================
-- storage: tour photos (public bucket for gallery URLs)
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tour-photos',
  'tour-photos',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read tour photos"
  ON storage.objects
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (bucket_id = 'tour-photos');

CREATE POLICY "Company owners upload tour photos"
  ON storage.objects
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'tour-photos'
    AND EXISTS (
      SELECT 1
      FROM public.companies co
      WHERE co.id::text = split_part(storage.objects.name, '/', 1)
        AND co.owner_profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins upload tour photos"
  ON storage.objects
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'tour-photos'
    AND public.is_admin()
  );
