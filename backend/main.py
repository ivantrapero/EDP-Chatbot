from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import logging
import difflib
import random
import csv
from datetime import datetime
from openai import OpenAI

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set.")
client = OpenAI(api_key=api_key)

# Dataset file
data_file = "datasets/edpdatasets.jsonl"

# CSV file for logging prompts
CSV_FILE = "askbot_prompts.csv"

def load_data():
    conversations = []
    with open(data_file, "r", encoding="utf-8") as file:
        for line in file:
            conversations.append(json.loads(line))
    return conversations

# Restricted words
restricted_keywords = [
    "personal", "confidential", "private", "account", "password",
    "address", "instructor name", "email", "contact", "phone number"
]

# Function to save prompt to CSV
def save_prompt_to_csv(prompt):
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(["timestamp", "prompt"])
    with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([datetime.utcnow().isoformat(), prompt])

def find_best_match(user_input, dataset):
    if any(word in user_input.lower() for word in restricted_keywords):
        return {
            "response": "I’m sorry, I am not allowed to answer that question. Please proceed to the EDP Front Office for assistance.",
            "choices": []
        }

    user_messages = [
        conv["messages"][-2]["content"] for conv in dataset if len(conv["messages"]) >= 2
    ]
    closest_matches = difflib.get_close_matches(user_input, user_messages, n=1, cutoff=0.7)

    if closest_matches:
        for conv in dataset:
            if len(conv["messages"]) >= 2 and conv["messages"][-2]["content"] == closest_matches[0]:
                choices = conv.get("choices", [])
                return {"response": conv["messages"][-1]["content"], "choices": choices}

    return None

def get_openai_response(user_message):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are AskBot, a reliable virtual assistant dedicated to UC Banilad's EDP Department. "
                               "Provide clear and helpful guidance about enrollment, class schedules, grades, requirements, "
                               "and services. If the question is out of scope, politely redirect to the EDP Front Office."
                },
                {"role": "user", "content": user_message}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"OpenAI API Error: {str(e)}")
        return "Sorry, I'm experiencing issues connecting to OpenAI."

@app.route("/chat", methods=["POST"])
def chat():
    user_data = request.get_json()

    # Intro message
    if user_data.get("start", False):
        return jsonify({
            "response": "Hello! I'm AskBot, your virtual assistant from UC Banilad's EDP Department. "
                        "I can help you with enrollment, class schedules, requirements, and other EDP services. "
                        "How can I assist you today?",
            "choices": ["Enrollment info", "Class schedule", "Grades", "Requirements"]
        })

    user_message = user_data.get("message", "").strip().lower()
    if not user_message:
        return jsonify({"error": "Message cannot be empty."}), 400

    # Save prompt to CSV
    save_prompt_to_csv(user_message)

    # Restriction check
    if any(word in user_message for word in restricted_keywords):
        return jsonify({
            "response": "I’m sorry, I am not allowed to answer that question. Please proceed to the EDP Front Office for assistance.",
            "choices": []
        })

    # Load dataset
    dataset = load_data()

    # Try dataset match
    match_result = find_best_match(user_message, dataset)
    dataset_choices = match_result["choices"] if match_result else []

    # Always get AI response
    ai_response = get_openai_response(user_message)

    # Default AI choices
    ai_choices = ["Okay", "Thanks", "Tell me more"]

    # Merge dataset + AI choices
    final_choices = list(set(dataset_choices + ai_choices))
    random.shuffle(final_choices)

    # If dataset match found → use dataset response
    if match_result:
        return jsonify({
            "response": match_result["response"],
            "choices": final_choices
        })

    # Otherwise fallback to AI
    return jsonify({
        "response": ai_response,
        "choices": final_choices
    })

if __name__ == "__main__":
    app.run(debug=True)
