# Verify Migration Status

## Quick Verification Checklist

### ✅ Step 1: Check Functions in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/togpvwfxmydgitkwqdgd/database/functions
2. Look for these functions:
   - ✅ `handle_new_user` - Should exist in `public` schema
   - ✅ `handle_user_update` - Should exist in `public` schema

### ✅ Step 2: Check Triggers in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/togpvwfxmydgitkwqdgd/database/triggers
2. Look for these triggers on `auth.users` table:
   - ✅ `on_auth_user_created` - Fires AFTER INSERT
   - ✅ `on_auth_user_updated` - Fires AFTER UPDATE OF email

### ✅ Step 3: Test the Trigger (Recommended)

The best way to verify is to test it:

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Register a test user**:
   - Go to: http://localhost:5173/register
   - Fill out the registration form
   - Submit

3. **Check Supabase Dashboard**:
   - Go to: Table Editor → `user_profiles`
   - You should see a new row automatically created with:
     - `id`: Same as the auth user ID
     - `email`: The email you registered with
     - `full_name`: The name you entered
     - `role`: `student` (default)

### ✅ Step 4: Verify via SQL Query

Run this in Supabase SQL Editor to check:

```sql
-- Check functions exist
SELECT 
    routine_name, 
    routine_type,
    routine_schema
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('handle_new_user', 'handle_user_update');

-- Check triggers exist
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
AND event_object_table = 'users'
AND trigger_name LIKE 'on_auth_user%';
```

## Expected Results

### Functions Should Show:
- `handle_new_user` - FUNCTION
- `handle_user_update` - FUNCTION

### Triggers Should Show:
- `on_auth_user_created` - INSERT trigger
- `on_auth_user_updated` - UPDATE trigger

## Troubleshooting

### If functions/triggers don't appear:
1. Check the SQL Editor for any error messages
2. Make sure you ran the entire SQL (all 40 lines)
3. Try running the migration again (it's safe to run multiple times)

### If trigger doesn't fire when registering:
1. Check that the trigger is enabled
2. Verify the function exists and is correct
3. Check Supabase logs for any errors
4. Make sure `user_profiles` table exists (from first migration)

### Common Issues:
- **"relation does not exist"**: Run the first migration (`001_initial_schema.sql`) first
- **"permission denied"**: Make sure you're using admin/service role
- **"function already exists"**: This is fine, the migration uses `CREATE OR REPLACE`

## Success Indicators

✅ Migration is successful if:
1. Both functions appear in Database → Functions
2. Both triggers appear in Database → Triggers
3. New user registration automatically creates a profile
4. No errors in Supabase logs

