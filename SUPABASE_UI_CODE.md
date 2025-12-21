# Supabase UI Deployment - Code and Instructions

## Function Name
```
generate-content
```

## Code to Paste in Supabase UI

Copy this entire code and paste it into the Supabase UI editor:

```typescript
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ALICLOUD_API_KEY = Deno.env.get('ALICLOUD_API_KEY');
const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/api/v1';

interface GenerateTextRequest {
  prompt: string;
  job_type: 'blog_post' | 'tool_description' | 'seo_content';
  max_length?: number;
}

interface GenerateImageRequest {
  prompt: string;
  width?: number;
  height?: number;
  style?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    // Generate text content
    if ((path.endsWith('/generate-text') || path.includes('/generate-text')) && req.method === 'POST') {
      const body: GenerateTextRequest = await req.json();
      
      if (!ALICLOUD_API_KEY) {
        return new Response(
          JSON.stringify({ success: false, error: 'AliCloud API key not configured' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch(
        `${DASHSCOPE_BASE_URL}/services/aigc/text-generation/generation`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ALICLOUD_API_KEY}`,
            'Content-Type': 'application/json',
            'X-DashScope-SSE': 'disable',
          },
          body: JSON.stringify({
            model: 'qwen-plus',
            input: {
              messages: [
                {
                  role: 'user',
                  content: body.prompt,
                },
              ],
            },
            parameters: {
              max_tokens: body.max_length || 2000,
              temperature: 0.7,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return new Response(
          JSON.stringify({ success: false, error: error }),
          { status: response.status, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const content = data.output?.choices?.[0]?.message?.content;

      if (!content) {
        return new Response(
          JSON.stringify({ success: false, error: 'Unexpected response format' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: { content },
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Generate image
    if ((path.endsWith('/generate-image') || path.includes('/generate-image')) && req.method === 'POST') {
      const body: GenerateImageRequest = await req.json();
      
      if (!ALICLOUD_API_KEY) {
        return new Response(
          JSON.stringify({ success: false, error: 'AliCloud API key not configured' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch(
        `${DASHSCOPE_BASE_URL}/services/aigc/image-generation/generation`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ALICLOUD_API_KEY}`,
            'Content-Type': 'application/json',
            'X-DashScope-SSE': 'disable',
          },
          body: JSON.stringify({
            model: 'wanx-v1',
            input: {
              prompt: body.prompt,
            },
            parameters: {
              size: `${body.width || 1024}*${body.height || 1024}`,
              ...(body.style && { style: body.style }),
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return new Response(
          JSON.stringify({ success: false, error: error }),
          { status: response.status, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const imageUrl = data.output?.results?.[0]?.url;

      if (!imageUrl) {
        return new Response(
          JSON.stringify({ success: false, error: 'Unexpected response format' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: { image_url: imageUrl },
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

## Steps in Supabase UI

1. **Function Name**: Type `generate-content` in the "Function name" field
2. **Replace Code**: Delete the default code and paste the code above
3. **Set Secret**: 
   - Click on "Secrets" in the left sidebar (under MANAGE)
   - Click "Add secret"
   - Key: `ALICLOUD_API_KEY`
   - Value: `sk-f457a807f49f4c958636696c751f7533`
   - Click "Save"
4. **Deploy**: Click the green "Deploy function" button

## After Deployment

Your function will be available at:
```
https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content
```

## Test It

After deployment, you can test with:

```bash
curl -L -X POST 'https://togpvwfxmydgitkwqdgd.supabase.co/functions/v1/generate-content/generate-text' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3B2d2Z4bXlkZ2l0a3dxZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODg2NzMsImV4cCI6MjA4MTg2NDY3M30.5lFeW3Cbis7H4CqaLHrV1-13Z0piJpQ6a3gQmDJ7Y2Y' \
  -H 'Content-Type: application/json' \
  --data '{"prompt": "寫一篇關於 AI 工具的介紹", "job_type": "blog_post", "max_length": 200}'
```

