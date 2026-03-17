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

