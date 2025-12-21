// Supabase Edge Function for AI Content Generation
// Replaces FastAPI backend

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ALICLOUD_API_KEY = Deno.env.get('ALICLOUD_API_KEY')
const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/api/v1'

interface GenerateTextRequest {
  prompt: string
  job_type: 'blog_post' | 'tool_description' | 'seo_content'
  max_length?: number
}

interface GenerateImageRequest {
  prompt: string
  width?: number
  height?: number
  style?: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    // Generate text content
    // Handle both /generate-text and /generate-content/generate-text paths
    if ((path.endsWith('/generate-text') || path.includes('/generate-text')) && req.method === 'POST') {
      const body: GenerateTextRequest = await req.json()
      
      if (!ALICLOUD_API_KEY) {
        return new Response(
          JSON.stringify({ success: false, error: 'AliCloud API key not configured' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
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
      )

      if (!response.ok) {
        const error = await response.text()
        return new Response(
          JSON.stringify({ success: false, error: error }),
          { status: response.status, headers: { 'Content-Type': 'application/json' } }
        )
      }

      const data = await response.json()
      const content = data.output?.choices?.[0]?.message?.content

      if (!content) {
        return new Response(
          JSON.stringify({ success: false, error: 'Unexpected response format' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
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
      )
    }

    // Generate image
    // Handle both /generate-image and /generate-content/generate-image paths
    if ((path.endsWith('/generate-image') || path.includes('/generate-image')) && req.method === 'POST') {
      const body: GenerateImageRequest = await req.json()
      
      if (!ALICLOUD_API_KEY) {
        return new Response(
          JSON.stringify({ success: false, error: 'AliCloud API key not configured' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
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
      )

      if (!response.ok) {
        const error = await response.text()
        return new Response(
          JSON.stringify({ success: false, error: error }),
          { status: response.status, headers: { 'Content-Type': 'application/json' } }
        )
      }

      const data = await response.json()
      const imageUrl = data.output?.results?.[0]?.url

      if (!imageUrl) {
        return new Response(
          JSON.stringify({ success: false, error: 'Unexpected response format' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
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
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

