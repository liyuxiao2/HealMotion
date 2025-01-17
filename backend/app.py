from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Enable CORS for all routes from the frontend origin

@app.route('/analyze', methods=['POST'])
def analyze_injury():
    data = request.get_json()
    injury = data.get('injury')

    GEMINI_API_URL = "https://api.gemini.com/analyze"
    API_KEY = os.getenv("GEMINI_API_KEY")
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    pre_prompt = (
        f"Given the injury '{injury}', generate a 7-day workout plan in JSON format. "
        "Each day should have a description of the exercise focusing on rehabilitation or safe training."
    )
    payload = {
        "prompt": pre_prompt
    }

    try:
        response = requests.post(GEMINI_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        gemini_data = response.json()
        return jsonify({"workoutPlan": gemini_data["workoutPlan"]})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)