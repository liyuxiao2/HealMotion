from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
import re

load_dotenv()

app = Flask(__name__)

CORS(app,
     resources={r"/*": {
         "origins": ["http://localhost:3000"],
         "methods": ["GET", "POST", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True
     }})

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("API key not found. Ensure GEMINI_API_KEY is set in your .env file.")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

user_profiles = {}

@app.route('/profile', methods=['POST'])
def update_profile():
    try:
        data = request.get_json()
        user_id = request.remote_addr
        user_profiles[user_id] = data
        print("Received profile data:", data)
        print("Stored profile data for user:", user_profiles[user_id])
        return jsonify({"message": "Profile updated successfully!"}), 200
    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_injury():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    try:
        data = request.get_json()
        injury = data.get('injury')

        if not injury:
            return jsonify({"error": "No injury provided"}), 400

        # Retrieve profile data
        user_id = request.remote_addr
        profile_data = user_profiles.get(user_id, {})

        if not isinstance(profile_data, dict):
            app.logger.error(f"Invalid profile data for user {user_id}: {profile_data}")
            return jsonify({"error": "Invalid profile data."}), 500

        # Extract profile information
        age = profile_data.get("age", "unknown")
        weight = profile_data.get("weight", "unknown")
        height = profile_data.get("height", "unknown")
        sex = profile_data.get("sex", "unknown")
        severity = profile_data.get("severity", "unknown")

        # Generate prompt
        pre_prompt = (
            f"Given the injury '{injury}' with {severity} severity, for a person aged {age}, weighing {weight} kg, sex: {sex}, and {height} cm tall, "
            "generate a detailed 7-day workout plan in JSON format. "
            "The response should include:"
            "  - 'workoutPlan': An object containing:"
            "      - 'days': A list of days, where each day is an object with the fields:"
            "          - 'day': The name of the day (e.g., 'Monday')."
            "          - 'exercises': A list of exercise objects, each with the fields:"
            "              - 'name': The name of the exercise."
            "              - 'reps': Repetitions and sets (e.g., '10-15 reps, 3 sets')."
            "              - 'url': A URL to a tutorial video or additional information."
        )

        # Get AI response
        response = model.generate_content(pre_prompt)
        raw_response_text = response.candidates[0].content.parts[0].text

        # Extract JSON from response
        json_match = re.search(r"{.*}", raw_response_text, re.DOTALL)
        if not json_match:
            raise ValueError("No valid JSON found in the response.")

        clean_response_text = json_match.group(0)
        response_json = json.loads(clean_response_text)

        # Ensure `workoutPlan` exists and contains `days`
        workout_plan = response_json.get("workoutPlan", {}).get("days", [])
        if not isinstance(workout_plan, list):
            raise ValueError("Invalid workout plan format: 'days' should be a list")

        # Simplify response for frontend
        simplified_response = []
        for day_data in workout_plan:
            day = day_data.get("day", "Unknown Day")
            exercises = day_data.get("exercises", [])

            if not isinstance(exercises, list):
                continue

            simplified_exercises = [
                {
                    "name": exercise.get("name", "Unknown Exercise"),
                    "reps": exercise.get("reps", ""),
                    "url": exercise.get("url", "")
                }
                for exercise in exercises
            ]
            simplified_response.append({"day": day, "exercises": simplified_exercises})

        if not simplified_response:
            raise ValueError("No valid workout data could be processed")

        return jsonify(simplified_response)

    except json.JSONDecodeError as parse_error:
        app.logger.error(f"Error parsing response: {parse_error}")
        return jsonify({"error": "Failed to parse AI response."}), 500
    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/diet', methods=['POST'])
def analyze_diet():
    try:
        data = request.get_json()
        injury = data.get('injury')

        if not injury:
            return jsonify({"error": "No injury provided"}), 400

        # Retrieve profile data
        user_id = request.remote_addr
        profile_data = user_profiles.get(user_id, {})

        if not isinstance(profile_data, dict):
            app.logger.error(f"Invalid profile data for user {user_id}: {profile_data}")
            return jsonify({"error": "Invalid profile data."}), 500

        # Extract profile information
        age = profile_data.get("age", "unknown")
        weight = profile_data.get("weight", "unknown")
        height = profile_data.get("height", "unknown")
        sex = profile_data.get("sex", "unknown")
        severity = profile_data.get("severity", "unknown")

        # Generate prompt for AI
        pre_prompt = (
            f"Given the injury '{injury}' with {severity} severity, for a person aged {age}, weighing {weight} kg, sex: {sex}, and {height} cm tall, "
            "generate a detailed 7-day diet plan in JSON format. Each day should include:"
            "  - 'day': The name of the day (e.g., 'Monday')."
            "  - 'meals': A list of meals for breakfast, lunch, and dinner."
        )

        # Get AI response
        response = model.generate_content(pre_prompt)
        raw_response_text = response.candidates[0].content.parts[0].text

        # Extract JSON from response
        json_match = re.search(r"{.*}", raw_response_text, re.DOTALL)
        if not json_match:
            raise ValueError("No valid JSON found in the response.")

        clean_response_text = json_match.group(0)
        response_json = json.loads(clean_response_text)

        # Extract diet plan from response
        diet_plan = response_json.get("dietPlan", [])

        if not isinstance(diet_plan, list):
            raise ValueError("Invalid diet plan format")

        # Simplify response for frontend
        simplified_response = []
        for day_data in diet_plan:
            day = day_data.get("day", "Unknown Day")
            meals = day_data.get("meals", [])
            simplified_meals = [
                {
                    "meal": meal.get("meal", "Unknown Meal"),
                    "items": meal.get("items", [])
                }
                for meal in meals
            ]
            simplified_response.append({"day": day, "meals": simplified_meals})

        return jsonify(simplified_response)

    except json.JSONDecodeError as parse_error:
        app.logger.error(f"Error parsing response: {parse_error}")
        return jsonify({"error": "Failed to parse AI response."}), 500
    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

    
    
if __name__ == '__main__':
    app.run(debug=True)