# Set the Secret in Supabase UI

## Issue
The function is deployed but the `ALICLOUD_API_KEY` secret is not set.

## Solution: Set the Secret

### In Supabase UI:

1. **Go to Edge Functions** → Click on "Secrets" in the left sidebar (under MANAGE)

2. **Add Secret**:
   - Click "Add secret" or "+" button
   - **Key**: `ALICLOUD_API_KEY`
   - **Value**: `sk-f457a807f49f4c958636696c751f7533`
   - Click "Save" or "Add"

3. **Verify**: The secret should appear in the list

## After Setting the Secret

The function will automatically use the secret. You don't need to redeploy!

## Test Again

After setting the secret, test with:

```bash
curl -L -X POST 'https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content/generate-text' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y' \
  -H 'Content-Type: application/json' \
  --data '{"prompt": "寫一篇關於 AI 工具的簡短介紹", "job_type": "blog_post", "max_length": 200}'
```

You should get a response with generated content!

