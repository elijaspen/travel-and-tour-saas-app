INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tour-photos',
  'tour-photos',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins upload tour photos"
  ON storage.objects
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (((bucket_id = 'tour-photos'::text) AND public.is_admin()));

CREATE POLICY "Company owners upload tour photos"
  ON storage.objects
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (bucket_id = 'tour-photos'::text)
    AND (
      EXISTS (
        SELECT 1
        FROM public.companies co
        WHERE co.id::text = split_part(storage.objects.name, '/', 1)
          AND co.owner_profile_id = auth.uid()
      )
    )
  );

CREATE POLICY "Public read tour photos"
  ON storage.objects
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING ((bucket_id = 'tour-photos'::text));
