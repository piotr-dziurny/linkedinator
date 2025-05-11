from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
import dotenv
import openai
import os

dotenv.load_dotenv()

az_client = SecretClient(
    vault_url = os.getenv("KEY_VAULT_URL"),
    credential = DefaultAzureCredential()
)

openai_client = openai.OpenAI(
        api_key = az_client.get_secret("OPENAI-API-KEY").value
)

def load_base_prompt(path: str, role: str, language: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        base_prompt = f.read()

    return base_prompt.format(role=role, language=language)

def generate_post(role: str, language:str, prompt: str = "") -> str:
    base_prompt = load_base_prompt("base_prompt.txt", role, language)

    response = openai_client.chat.completions.create(
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
