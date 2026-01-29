#!/usr/bin/env python3
"""
Test script for /api/ai/chat endpoint

Usage:
    python test_chat_endpoint.py

Make sure the FastAPI server is running:
    cd backend
    uvicorn main:app --reload
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:8000"
ENDPOINT = f"{BASE_URL}/api/ai/chat"

def test_chat_stream():
    """Test the streaming chat endpoint"""
    print("Testing /api/ai/chat endpoint...")
    print(f"Endpoint: {ENDPOINT}\n")
    
    # Test request payload
    payload = {
        "messages": [
            {
                "role": "user",
                "content": "Hello! Can you explain what is Python?"
            }
        ],
        "language": "en",
        "model": "qwen-plus",
        "temperature": 0.7
    }
    
    print("Request payload:")
    print(json.dumps(payload, indent=2))
    print("\n" + "="*50)
    print("Streaming response:\n")
    
    try:
        # Make streaming request
        response = requests.post(
            ENDPOINT,
            json=payload,
            stream=True,
            headers={"Content-Type": "application/json"},
            timeout=60
        )
        
        # Check status code
        if response.status_code != 200:
            print(f"Error: Status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        # Stream the response
        full_content = ""
        for line in response.iter_lines():
            if line:
                line_str = line.decode('utf-8')
                print(line_str)
                
                # Parse SSE data
                if line_str.startswith("data: "):
                    data_str = line_str[6:].strip()
                    
                    if data_str == "[DONE]":
                        print("\n[Stream completed]")
                        break
                    
                    try:
                        data = json.loads(data_str)
                        if "choices" in data and len(data["choices"]) > 0:
                            delta = data["choices"][0].get("delta", {})
                            content = delta.get("content", "")
                            if content:
                                full_content += content
                    except json.JSONDecodeError:
                        pass
        
        print("\n" + "="*50)
        print(f"Full response length: {len(full_content)} characters")
        print(f"First 200 chars: {full_content[:200]}...")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server.")
        print("Make sure the FastAPI server is running:")
        print("  cd backend")
        print("  uvicorn main:app --reload")
        return False
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_chat_stream()
    sys.exit(0 if success else 1)
