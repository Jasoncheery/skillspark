from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Literal
import os
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

@app.get("/api/ai/jobs/{job_id}")
async def get_job_status(job_id: str):
    # In production, fetch from database
    return {"status": "completed", "job_id": job_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

