# How to Run the Database Migration

## Option 1: Supabase Dashboard (Recommended - Easiest)

1. **Open Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard/project/togpvwfxmydgitkwqdgd/sql/new
   - Or navigate: Dashboard → SQL Editor → New Query

2. **Copy the SQL**:
   - Open: `supabase/migrations/002_create_user_profile_trigger.sql`
   - Copy all the SQL content

3. **Paste and Run**:
   - Paste the SQL into the SQL Editor
   - Click the "Run" button (or press Cmd/Ctrl + Enter)
   - Wait for "Success" message

4. **Verify**:
   - Go to Database → Functions
   - You should see `handle_new_user` and `handle_user_update` functions
   - Go to Database → Triggers
   - You should see the triggers on `auth.users` table

## Option 2: Supabase CLI

If you have Supabase CLI installed and linked:

```bash
# Link your project (first time only)
supabase link --project-ref togpvwfxmydgitkwqdgd

# Run the migration
supabase db push
```

## Option 3: psql (PostgreSQL Client)

If you have `psql` installed:

1. Get connection string from Supabase Dashboard:
   - Go to: Settings → Database
   - Copy the "Connection string" (use the "URI" format)

2. Run the migration:
```bash
psql "your-connection-string" -f supabase/migrations/002_create_user_profile_trigger.sql
```

## What This Migration Does

This migration creates:

1. **`handle_new_user()` function**: Automatically creates a user profile when a new user signs up
2. **`on_auth_user_created` trigger**: Fires when a user is created in `auth.users`
3. **`handle_user_update()` function**: Updates user profile when email changes
4. **`on_auth_user_updated` trigger**: Fires when email is updated in `auth.users`

## Verification

After running the migration, test it:

1. Register a new user through the website
2. Check Supabase Dashboard → Table Editor → `user_profiles`
3. You should see a new profile automatically created with:
   - Same `id` as the auth user
   - Email from auth user
   - Full name from signup form
   - Default role: `student`

## Troubleshooting

### Error: "function already exists"
- This is fine, the migration uses `CREATE OR REPLACE`
- Just run it again

### Error: "permission denied"
- Make sure you're using the service role key or have admin access
- Check that RLS policies allow the operation

### Trigger not firing
- Check that triggers are enabled in Supabase
- Verify the trigger exists: `SELECT * FROM pg_trigger WHERE tgname LIKE 'on_auth_user%';`

