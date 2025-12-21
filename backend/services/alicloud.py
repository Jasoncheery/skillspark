import os
import json
from typing import Optional
import httpx

class AliCloudService:
    """
    AliCloud DashScope AI Service wrapper for text and image generation
    Uses DashScope API with Qwen models
    """
    
    def __init__(self, api_key: str):
        """
        Initialize with DashScope API key (format: sk-...)
        """
        self.api_key = api_key
        self.base_url = "https://dashscope.aliyuncs.com/api/v1"
        
    async def generate_text(
        self,
        prompt: str,
        model: str = "qwen-plus",  # qwen-plus for better quality, qwen-turbo for speed
        max_length: int = 2000,
        temperature: float = 0.7
    ) -> str:
        """
        Generate text using AliCloud's Qwen model
        
        Available models:
        - qwen-turbo: Fast and cost-effective, good for simple tasks
        - qwen-plus: Balanced performance and quality, recommended for content generation
        - qwen-max: Most capable, best quality but slower and more expensive
        """
        if not self.api_key:
            raise ValueError("AliCloud API key not configured")
        
        url = f"{self.base_url}/services/aigc/text-generation/generation"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "X-DashScope-SSE": "disable"
        }
        
        payload = {
            "model": model,
            "input": {
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            },
            "parameters": {
                "max_tokens": max_length,
                "temperature": temperature
            }
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(url, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                
                if "output" in data and "choices" in data["output"]:
                    return data["output"]["choices"][0]["message"]["content"]
                else:
                    raise ValueError(f"Unexpected response format: {data}")
                    
            except httpx.HTTPError as e:
                raise Exception(f"AliCloud API error: {str(e)}")
    
    async def generate_image(
        self,
        prompt: str,
        width: int = 1024,
        height: int = 1024,
        style: Optional[str] = None,
        model: str = "wanx-v1"
    ) -> str:
        """
        Generate image using AliCloud's Wanx model
        """
        if not self.api_key:
            raise ValueError("AliCloud API key not configured")
        
        url = f"{self.base_url}/services/aigc/image-generation/generation"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "X-DashScope-SSE": "disable"
        }
        
        payload = {
            "model": model,
            "input": {
                "prompt": prompt
            },
            "parameters": {
                "size": f"{width}*{height}",
            }
        }
        
        if style:
            payload["parameters"]["style"] = style
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                response = await client.post(url, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                
                if "output" in data and "results" in data["output"]:
                    return data["output"]["results"][0]["url"]
                else:
                    raise ValueError(f"Unexpected response format: {data}")
                    
            except httpx.HTTPError as e:
                raise Exception(f"AliCloud API error: {str(e)}")

