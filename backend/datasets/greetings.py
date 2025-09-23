from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# simple greetings list
GREETINGS = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"]

def is_greeting(user_message: str) -> bool:
    """Check if user input is a greeting."""
    return any(greet in user_message.lower() for greet in GREETINGS)

def get_greeting_response(user_message: str) -> str:
    """Use OpenAI to generate a greeting response."""
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are AskBot, a friendly assistant for EDP students."},
            {"role": "user", "content": user_message}
        ]
    )
    return completion.choices[0].message.content.strip()
