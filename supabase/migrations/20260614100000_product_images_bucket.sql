-- Public bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
CREATE POLICY "auth upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update/replace
CREATE POLICY "auth update product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');

-- Allow authenticated users to delete
CREATE POLICY "auth delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- Public read (bucket is already public but policy makes it explicit)
CREATE POLICY "public read product images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'product-images');
