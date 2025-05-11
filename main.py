from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai_client import generate_post
import dotenv
import os

dotenv.load_dotenv()

app = FastAPI()

allowed_origins = os.getenv("FRONTEND_URL")

app.add_middleware(
        CORSMiddleware,
        allow_origins=[allowed_origins],
        allow_methods=["*"],
        allow_headers=["*"],
    )

class PromptRequest(BaseModel):
    role: str
    language: str
    prompt: str = ""

@app.post("/generate")
async def generate(data: PromptRequest):
    try:
        result = generate_post(
                role = data.role,
                language = data.language,
                prompt = data.prompt
            )
        return {"result": result}
    except Exception as e:
        return {"error": str(e)}
