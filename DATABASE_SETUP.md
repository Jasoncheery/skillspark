# Database Setup Instructions

## Quick Setup

1. Go to your Supabase project dashboard: https://togpvwfxmydgitkwqdgd.supabase.co
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
6. Wait for the migration to complete (should see "Success" message)

## What Gets Created

The migration will create:

- **Tables**:
  - `user_profiles` - User information and roles
  - `ai_tools` - AI tool listings
  - `lessons` - Online/offline lessons
  - `lesson_content` - Lesson materials and videos
  - `lesson_registrations` - Student enrollments
  - `blog_posts` - Blog articles
  - `pages` - Custom pages
  - `images` - Image library
  - `content_generation_jobs` - AI generation queue

- **Security**:
  - Row Level Security (RLS) policies
  - Public read access for published content
  - Admin write access
  - User-specific access controls

- **Functions**:
  - Auto-update `updated_at` timestamps

## Verification

After running the migration:

1. Go to "Table Editor" in Supabase
2. You should see all the tables listed above
3. Check that RLS is enabled (lock icon next to table names)

## Creating Your First Admin User

After the migration, you'll need to:

1. Sign up a user through the website (or Supabase Auth)
2. Go to Supabase Dashboard → Table Editor → `user_profiles`
3. Find your user and update the `role` field to `'admin'`

Or run this SQL (replace `YOUR_USER_EMAIL` with your actual email):

```sql
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'YOUR_USER_EMAIL';
```

## Troubleshooting

### Migration Fails

- Check for existing tables that might conflict
- Ensure you have proper permissions in Supabase
- Check the error message for specific issues

### Tables Not Appearing

- Refresh the Table Editor
- Check if migration completed successfully
- Verify you're in the correct project

### RLS Issues

- Ensure RLS policies were created (check the migration output)
- Verify policies in Supabase Dashboard → Authentication → Policies

