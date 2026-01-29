import os
import json
from typing import Optional, List, Dict, AsyncIterator
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
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str = "qwen-plus",
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        language: str = "en"
    ) -> AsyncIterator[str]:
        """
        Chat completion with streaming support using Server-Sent Events (SSE)
        
        Args:
            messages: List of message dicts with 'role' and 'content' keys
            model: Qwen model to use (qwen-turbo, qwen-plus, qwen-max)
            temperature: Sampling temperature (0.0 to 1.0)
            max_tokens: Maximum tokens to generate
            language: Language preference ('en' or 'zh-TW')
        
        Yields:
            Content chunks as strings from the streaming response
        
        Raises:
            ValueError: If API key not configured
            Exception: If API request fails
        """
        if not self.api_key:
            raise ValueError("AliCloud API key not configured")
        
        # System prompt for AI Tutor
        system_prompt = """You are SkillSpark AI Tutor (技撚星火 AI 助教), an intelligent and friendly education assistant. You help students learn by:

1. Explaining concepts clearly and at the appropriate level
2. Breaking down complex topics into digestible parts
3. Providing examples and analogies to aid understanding
4. Encouraging questions and curiosity
5. Offering practice problems when appropriate
6. Adapting your language based on whether the student writes in English or Traditional Chinese (繁體中文)

Important guidelines:
- Always be patient, supportive, and encouraging
- If a student is struggling, try different approaches to explain
- Use emojis sparingly to keep things friendly 🎓
- When providing code examples, use proper formatting
- For math, use clear notation
- If you don't know something, admit it honestly
- Keep responses focused and not too lengthy unless explaining complex topics

You can help with subjects including: Mathematics, Science, Programming, Languages, History, and more."""
        
        # Localize system prompt
        if language == "zh-TW":
            system_prompt += "\n\n請優先使用繁體中文回覆，除非學生使用英文提問。"
        
        # Prepare messages with system prompt
        formatted_messages = [
            {"role": "system", "content": system_prompt},
            *messages
        ]
        
        url = f"{self.base_url}/services/aigc/text-generation/generation"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "X-DashScope-SSE": "enable"  # Enable SSE streaming
        }
        
        payload = {
            "model": model,
            "input": {
                "messages": formatted_messages
            },
            "parameters": {
                "temperature": temperature
            }
        }
        
        if max_tokens:
            payload["parameters"]["max_tokens"] = max_tokens
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                async with client.stream("POST", url, headers=headers, json=payload) as response:
                    # Check for errors
                    if response.status_code == 429:
                        raise Exception("Rate limit exceeded. Please try again in a moment.")
                    elif response.status_code == 402:
                        raise Exception("AI service requires credits. Please contact support.")
                    elif not response.is_success:
                        error_text = await response.aread()
                        raise Exception(f"AI service error: {response.status_code} - {error_text.decode()}")
                    
                    # Stream SSE events
                    async for line in response.aiter_lines():
                        if not line.strip():
                            continue
                        
                        # Skip SSE comment lines
                        if line.startswith(":"):
                            continue
                        
                        # Parse SSE data lines
                        if line.startswith("data: "):
                            data_str = line[6:].strip()
                            
                            # Check for end of stream
                            if data_str == "[DONE]":
                                break
                            
                            try:
                                data = json.loads(data_str)
                                
                                # Extract content from response
                                if "output" in data and "choices" in data["output"]:
                                    choice = data["output"]["choices"][0]
                                    if "delta" in choice and "content" in choice["delta"]:
                                        content = choice["delta"]["content"]
                                        if content:
                                            yield content
                                    elif "message" in choice and "content" in choice["message"]:
                                        content = choice["message"]["content"]
                                        if content:
                                            yield content
                            except json.JSONDecodeError:
                                # Skip invalid JSON lines
                                continue
                            
            except httpx.HTTPError as e:
                raise Exception(f"AliCloud API error: {str(e)}")

