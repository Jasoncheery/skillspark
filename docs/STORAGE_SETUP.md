# Supabase Storage Setup

## Image Library Storage Bucket

The image library feature requires a Supabase Storage bucket to be created.

### Steps to Create the Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the sidebar
3. Click **New bucket**
4. Create a bucket named: `images`
5. Set the bucket to **Public** (so images can be accessed via public URLs)
6. Configure RLS policies (see below)

### Storage Policies

The bucket should have the following Row Level Security policies:

#### Public Read Access
```sql
-- Allow anyone to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');
```

#### Admin Upload Access
```sql
-- Allow admins to upload images
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### Admin Delete Access
```sql
-- Allow admins to delete images
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' AND
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Alternative: Use Supabase Dashboard

You can also set up these policies through the Supabase dashboard:
1. Go to Storage → Policies
2. Select the `images` bucket
3. Create policies for SELECT, INSERT, and DELETE operations
4. Use the policy templates above

### File Size Limits

- Maximum file size: 10MB (enforced in the frontend)
- Supported formats: PNG, JPG, GIF, WebP, SVG
- Images are automatically organized by user ID in the storage path

### Notes

- Images are stored with the path: `{user_id}/{timestamp}-{random}.{ext}`
- Public URLs are generated automatically
- Image dimensions are extracted and stored in the database
- When an image is deleted, both the storage file and database record are removed

