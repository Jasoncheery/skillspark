#!/usr/bin/env python3
"""
Run Supabase migration using Management API
"""
import requests
import json
import sys

# Supabase credentials
SUPABASE_URL = "https://togpvwfxmydgitkwqdgd.supabase.co"
import os
SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SERVICE_ROLE_KEY:
    print("❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required")
    print("   Set it in your .env file or export it before running this script")
    exit(1)
PROJECT_REF = "togpvwfxmydgitkwqdgd"

# Read SQL file
try:
    with open('supabase/migrations/002_create_user_profile_trigger.sql', 'r') as f:
        sql_content = f.read()
except FileNotFoundError:
    print("Error: Migration file not found")
    sys.exit(1)

# Use Supabase Management API
# Note: This requires the Management API access token, not the service role key
# For now, we'll use the Supabase Dashboard approach

print("=" * 60)
print("SUPABASE MIGRATION SQL")
print("=" * 60)
print("\nSince Supabase REST API doesn't support direct SQL execution,")
print("please copy and paste this SQL into your Supabase Dashboard:")
print("\n1. Go to: https://supabase.com/dashboard/project/togpvwfxmydgitkwqdgd/sql/new")
print("2. Paste the SQL below")
print("3. Click 'Run'")
print("\n" + "=" * 60)
print(sql_content)
print("=" * 60)

# Alternative: Try using Supabase CLI if linked
print("\n\nAlternatively, if you have Supabase CLI linked to your project:")
print("  supabase db push")
