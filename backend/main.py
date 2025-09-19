from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import difflib

app = Flask(__name__)
CORS(app)

data_file = "datasets/edpdatasets.jsonl"

def load_data():
    conversations = []
    with open(data_file, "r", encoding="utf-8") as file:
        for line in file:
            conversations.append(json.loads(line))
    return conversations

restricted_keywords = ["personal", "confidential", "private", "account", "password", "address", "instructor name", "email", "contact",
                       "phone number"]

def find_best_match(user_input, dataset):
    # Restriction check
    if any(word in user_input.lower() for word in restricted_keywords):
        return "I’m sorry, I am not allowed to answer that question. Please proceed to the EDP Front Office for assistance."

    # Normal matching
    user_messages = [
        conv["messages"][-2]["content"] for conv in dataset if len(conv["messages"]) >= 2
    ]
    closest_matches = difflib.get_close_matches(user_input, user_messages, n=1, cutoff=0.7)

    if closest_matches:
        for conv in dataset:
            if len(conv["messages"]) >= 2 and conv["messages"][-2]["content"] == closest_matches[0]:
                return conv["messages"][-1]["content"]

    return "I'm sorry, I don't have an answer for that. Please proceed to the EDP Front Office for more information."

@app.route("/chat", methods=["POST"])
def chat():
    user_data = request.get_json()
    user_message = user_data.get("message", "").strip().lower()

    if not user_message:
        return jsonify({"error": "Message cannot be empty."}), 400

    # 🔹 Restriction check first
    if any(word in user_message for word in restricted_keywords):
        return jsonify({
            "response": "I’m sorry, I am not allowed to answer that question. Please proceed to the EDP Front Office for assistance."
        })

    # then dataset matching
    dataset = load_data()
    response = find_best_match(user_message, dataset)

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)