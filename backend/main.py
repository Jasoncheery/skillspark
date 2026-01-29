from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Literal, List, Dict
import os
import json
from services.alicloud import AliCloudService

app = FastAPI(title="SkillSpark API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AliCloud service
# DashScope uses a single API key (format: sk-...)
alicloud_service = AliCloudService(
    api_key=os.getenv("ALICLOUD_API_KEY")
)

# Request models
class GenerateTextRequest(BaseModel):
    prompt: str
    job_type: Literal["blog_post", "tool_description", "seo_content"]
    target_type: Optional[str] = None
    target_id: Optional[str] = None
    max_length: Optional[int] = 2000

class GenerateImageRequest(BaseModel):
    prompt: str
    width: Optional[int] = 1024
    height: Optional[int] = 1024
    style: Optional[str] = None

class GenerationResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    job_id: Optional[str] = None
    error: Optional[str] = None

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    language: Optional[str] = "en"  # "en" or "zh-TW"
    model: Optional[str] = "qwen-plus"  # qwen-turbo, qwen-plus, qwen-max
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = None

@app.get("/")
async def root():
    return {"message": "SkillSpark API", "version": "1.0.0"}

@app.post("/api/ai/generate-text", response_model=GenerationResponse)
async def generate_text(request: GenerateTextRequest):
    try:
        # Use qwen-plus for better quality content generation
        # Can be changed to qwen-turbo for speed or qwen-max for best quality
        result = await alicloud_service.generate_text(
            prompt=request.prompt,
            model="qwen-plus",  # Recommended for blog posts and tool descriptions
            max_length=request.max_length or 2000
        )
        return GenerationResponse(
            success=True,
            data={"content": result},
            job_id=None  # In production, create job record
        )
    except Exception as e:
        return GenerationResponse(
            success=False,
            error=str(e)
        )

@app.post("/api/ai/generate-image", response_model=GenerationResponse)
async def generate_image(request: GenerateImageRequest):
    try:
        result = await alicloud_service.generate_image(
            prompt=request.prompt,
            width=request.width,
            height=request.height,
            style=request.style
        )
        return GenerationResponse(
            success=True,
            data={"image_url": result},
            job_id=None
        )
    except Exception as e:
        return GenerationResponse(
            success=False,
            error=str(e)
        )

@app.post("/api/ai/chat")
async def chat_stream(request: ChatRequest):
    """
    Streaming chat endpoint for AI Assistant
    
    Uses Server-Sent Events (SSE) to stream responses in real-time.
    Compatible with OpenAI-style chat completion format.
    
    Request body:
    - messages: List of chat messages with role and content
    - language: Optional language preference ("en" or "zh-TW")
    - model: Optional Qwen model ("qwen-turbo", "qwen-plus", "qwen-max")
    - temperature: Optional sampling temperature (0.0-1.0)
    - max_tokens: Optional maximum tokens to generate
    
    Returns:
    - SSE stream with data: prefixed JSON chunks
    - Format: data: {"choices": [{"delta": {"content": "..."}}]}
    - End marker: data: [DONE]
    """
    try:
        # Convert Pydantic models to dicts for AliCloud service
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        async def generate():
            try:
                async for chunk in alicloud_service.chat_completion(
                    messages=messages,
                    model=request.model,
                    temperature=request.temperature,
                    max_tokens=request.max_tokens,
                    language=request.language
                ):
                    # Format as SSE event (OpenAI-compatible format)
                    event_data = {
                        "choices": [{
                            "delta": {
                                "content": chunk
                            }
                        }]
                    }
                    yield f"data: {json.dumps(event_data)}\n\n"
                
                # Send end marker
                yield "data: [DONE]\n\n"
                
            except Exception as e:
                # Send error as SSE event
                error_data = {
                    "error": {
                        "message": str(e),
                        "type": "api_error"
                    }
                }
                yield f"data: {json.dumps(error_data)}\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"  # Disable buffering in nginx
            }
        )
        
    except ValueError as e:
        # API key not configured
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        # Other errors
        raise HTTPException(status_code=500, detail=f"Chat service error: {str(e)}")

@app.get("/api/ai/jobs/{job_id}")
async def get_job_status(job_id: str):
    # In production, fetch from database
    return {"status": "completed", "job_id": job_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

