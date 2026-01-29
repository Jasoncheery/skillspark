# Chat Endpoint Testing Guide

## Endpoint: `/api/ai/chat`

Streaming chat endpoint for AI Assistant using Server-Sent Events (SSE).

## Quick Test with curl

```bash
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Hello! Can you explain what is Python?"
      }
    ],
    "language": "en",
    "model": "qwen-plus"
  }' \
  --no-buffer
```

## Test with Python Script

```bash
cd backend
python test_chat_endpoint.py
```

## Request Format

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Your question here"
    }
  ],
  "language": "en",           // Optional: "en" or "zh-TW"
  "model": "qwen-plus",       // Optional: "qwen-turbo", "qwen-plus", "qwen-max"
  "temperature": 0.7,        // Optional: 0.0 to 1.0
  "max_tokens": null          // Optional: Maximum tokens to generate
}
```

## Response Format

Server-Sent Events (SSE) stream:

```
data: {"choices": [{"delta": {"content": "Hello"}}]}

data: {"choices": [{"delta": {"content": "! "}}]}

data: {"choices": [{"delta": {"content": "Python"}}]}

...

data: [DONE]
```

## Error Handling

The endpoint handles:
- **429**: Rate limit exceeded
- **402**: AI service requires credits
- **500**: Other API errors

Errors are returned as SSE events:
```
data: {"error": {"message": "Error message", "type": "api_error"}}
```

## Environment Variables

Make sure `ALICLOUD_API_KEY` is set:

```bash
export ALICLOUD_API_KEY=sk-your-api-key-here
```

## Start Server

```bash
cd backend
uvicorn main:app --reload
```

The endpoint will be available at: `http://localhost:8000/api/ai/chat`
