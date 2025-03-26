import os
import dotenv
import openai

dotenv.load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

client = openai.OpenAI()

role = input("Role: ")
theme = input("Choose a theme that represents the story you want to tell: ")
language = input("Language: ") 

user_input = input("Insert text you want to turn into Linkedin-style post (or leave blank): ")

def load_base_prompt(path, role, theme, language):
    with open(path, "r", encoding="utf-8") as f:
        base_prompt = f.read()

    return base_prompt.format(role=role, theme=theme, language=language)

base_prompt = load_base_prompt("base_prompt.txt", role, theme, language)

completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "developer",
            "content": base_prompt
        },

        {
            "role": "user",
            "content": user_input
        }
    ]
)

print(completion.choices[0].message.content)
