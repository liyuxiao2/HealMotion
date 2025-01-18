from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Enable CORS for frontend origin

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("API key not found. Ensure GEMINI_API_KEY is set in your .env file.")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")

@app.route('/analyze', methods=['POST'])
def analyze_injury():
    try:
        data = request.get_json()
        injury = data.get('injury')
        if not injury:
            return jsonify({"error": "No injury provided"}), 400

        # Create the prompt for the API
        pre_prompt = (
            f"Given the injury '{injury}', generate a 7-day workout plan in JSON format. "
            "The JSON should have keys as days of the week (Monday to Sunday) and values as lists of exercises along with the number of repetitions."
            "For the exercises format them similairly to this Pelvic-Thrusts, Knee-Bends, add dashes in between if neccesary."
            "Each day should have a description of the exercise focusing on rehabilitation or safe training."
        )

        # Use the Gemini API to generate content
        response = model.generate_content(pre_prompt)

        # Extract the primary text from the API response
        raw_response_text = response.candidates[0].content.parts[0].text
        
        print("Raw Response Text:\n", raw_response_text)

        # Parse the response text to extract JSON
        try:
            # Remove code block markers (```json ... ```) if present
            if raw_response_text.startswith("```json"):
                raw_response_text = raw_response_text[7:].strip("```")

            # Locate the JSON start and end
            json_start = raw_response_text.find("{")
            json_end = raw_response_text.rfind("}") + 1

            # Extract only the JSON part
            clean_response_text = raw_response_text[json_start:json_end]

            print("Cleaned JSON Text:\n", clean_response_text)

            # Load the JSON response
            response_json = json.loads(clean_response_text)

            # Transform the response into the expected format
            simplified_response = []
            simplified_day = {}

            for day, exercises in response_json.items():
                simplified_day[day] = [f"{exercise['exercise']} {exercise['reps']}" for exercise in exercises]
            
            simplified_response.append(simplified_day)

            print("Simplified Response:\n", simplified_response)

        except json.JSONDecodeError as parse_error:
            app.logger.error(f"Error parsing response: {parse_error}")
            app.logger.error(f"Problematic Text:\n{raw_response_text}")
            return jsonify({"error": "Failed to parse AI response."}), 500

        # Return the transformed response
        return jsonify(simplified_response)

    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)