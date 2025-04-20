
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential
import logging
from dotenv import load_dotenv
import os

load_dotenv()

logger = logging.getLogger(__name__)
API_TOKEN = os.getenv("API_TOKEN")
HUGGINGFACE_SUMMARY_API = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
async def summarize_text(text: str) -> str:
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "accept": "application/json"
    }
    payload = {"inputs": text, "parameters": {"max_length": 100}}
    async with httpx.AsyncClient() as client:
        response = await client.post(HUGGINGFACE_SUMMARY_API, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, list) and "summary_text" in data[0]:
            return data[0]["summary_text"]
        elif isinstance(data, dict) and "error" in data:
            logger.error(f"Hugging Face API error: {data['error']}")
            return f"[AI Error] {data['error']}"
        logger.error("Error summarizing text: Invalid response format")
        return "[Error summarizing text]"

async def send_notification(db, user, message, type="info"):
    from crud import create_notification
    return await create_notification(db, user, message, type)
