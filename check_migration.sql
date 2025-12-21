-- Quick verification queries
-- Run these in Supabase SQL Editor

-- 1. Check if functions exist
SELECT 
    routine_name, 
    routine_type,
    routine_schema
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('handle_new_user', 'handle_user_update');

-- 2. Check if triggers exist
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
AND event_object_table = 'users'
AND trigger_name LIKE 'on_auth_user%';

-- 3. Check user_profiles table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position;
