import os
import dotenv
import openai

dotenv.load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

client = openai.OpenAI()

def load_base_prompt(path: str, role: str, language: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        base_prompt = f.read()

    return base_prompt.format(role=role, language=language)

def generate_post(role: str, language:str, prompt: str = "") -> str:
    base_prompt = load_base_prompt("base_prompt.txt", role, language)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "developer",
                "content": base_prompt
            },

            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content
