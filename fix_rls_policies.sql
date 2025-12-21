-- Fix RLS policies to avoid infinite recursion
-- Run this in Supabase SQL Editor

-- Drop the problematic admin policy that causes recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Create a security definer function to check admin role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- Recreate admin policy using the function (avoids recursion)
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Update other policies to use the function instead of direct query
DROP POLICY IF EXISTS "Admins can manage AI tools" ON public.ai_tools;
CREATE POLICY "Admins can manage AI tools"
  ON public.ai_tools FOR ALL
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Teachers and admins can manage lessons" ON public.lessons;
CREATE POLICY "Teachers and admins can manage lessons"
  ON public.lessons FOR ALL
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

DROP POLICY IF EXISTS "Teachers and admins can manage lesson content" ON public.lesson_content;
CREATE POLICY "Teachers and admins can manage lesson content"
  ON public.lesson_content FOR ALL
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

DROP POLICY IF EXISTS "Teachers and admins can view all registrations" ON public.lesson_registrations;
CREATE POLICY "Teachers and admins can view all registrations"
  ON public.lesson_registrations FOR SELECT
  USING (
    public.is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts"
  ON public.blog_posts FOR ALL
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage pages" ON public.pages;
CREATE POLICY "Admins can manage pages"
  ON public.pages FOR ALL
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage images" ON public.images;
CREATE POLICY "Admins can manage images"
  ON public.images FOR ALL
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all jobs" ON public.content_generation_jobs;
CREATE POLICY "Admins can view all jobs"
  ON public.content_generation_jobs FOR SELECT
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can create jobs" ON public.content_generation_jobs;
CREATE POLICY "Admins can create jobs"
  ON public.content_generation_jobs FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon, authenticated;

