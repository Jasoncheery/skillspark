#!/bin/bash
# Script to deploy Supabase Edge Function

echo "=========================================="
echo "Deploying Supabase Edge Function"
echo "=========================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if logged in
echo ""
echo "Step 1: Checking Supabase login status..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in. Please run:"
    echo "   supabase login"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Logged in to Supabase"

# Set the secret
echo ""
echo "Step 2: Setting ALICLOUD_API_KEY secret..."
supabase secrets set ALICLOUD_API_KEY=sk-f457a807f49f4c958636696c751f7533

if [ $? -eq 0 ]; then
    echo "✅ Secret set successfully"
else
    echo "❌ Failed to set secret"
    exit 1
fi

# Deploy the function
echo ""
echo "Step 3: Deploying Edge Function..."
supabase functions deploy generate-content

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ Deployment Complete!"
    echo "=========================================="
    echo ""
    echo "Edge Function URL:"
    echo "https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content"
    echo ""
    echo "Test endpoints:"
    echo "- Generate Text: /generate-text"
    echo "- Generate Image: /generate-image"
    echo ""
else
    echo "❌ Deployment failed"
    exit 1
fi
