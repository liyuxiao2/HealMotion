from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allows all origins (not recommended for production)


API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("API key not found. Ensure GEMINI_API_KEY is set in your .env file.")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")




user_profiles = {}

@app.route('/profile', methods=['POST'])  # New route for profile data
def update_profile():
    global profile_data
    try:
        data = request.get_json()  # Get the JSON data sent from the frontend
        user_id = request.remote_addr  # Use the client's IP as a unique identifier
        user_profiles[user_id] = data  # Store the profile data
        print("Received profile data:", data)  # Log the incoming data
        user_profiles[user_id] = data  # Store the profile data
        print("Stored profile data for user:", user_profiles[user_id])
        return jsonify({"message": "Profile updated successfully!"}), 200
    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
    
    

@app.route('/analyze', methods=['POST'])
def analyze_injury():
    try:
        data = request.get_json()
        injury = data.get('injury')

        if not injury:
            return jsonify({"error": "No injury provided"}), 400

        # Retrieve profile data for the current user
        user_id = request.remote_addr
        profile_data = user_profiles.get(user_id, {})

        if not isinstance(profile_data, dict):
            app.logger.error(f"Invalid profile data for user {user_id}: {profile_data}")
            return jsonify({"error": "Invalid profile data."}), 500

        print("Profile Data (value):", profile_data)

        age = profile_data.get("age", "unknown")
        weight = profile_data.get("weight", "unknown")
        height = profile_data.get("height", "unknown")
        sex = profile_data.get("sex", "unknown")
        severity = profile_data.get("severity", "unknown")

        pre_prompt = (
            f"Given the injury '{injury}' with {severity} severity, for a person aged {age}, weighing {weight} kg, sex: {sex}, and {height} cm tall, "
            "generate a detailed 7-day workout plan in JSON format. "
            "Each day should include:"
            "  - 'day': The name of the day (e.g., 'Monday')."
            "  - 'exercises': A list of objects, each with the following fields:"
            "      - 'name': Name of the exercise."
            "      - 'reps': Repetitions and sets (e.g., '10-15 reps, 3 sets')."
            "      - 'url': URL of a video or tutorial."
        )

        response = model.generate_content(pre_prompt)

        raw_response_text = response.candidates[0].content.parts[0].text

        try:
            if raw_response_text.startswith("```json"):
                raw_response_text = raw_response_text[7:].strip("```")

            response_json = json.loads(raw_response_text)
            workout_plan = response_json.get("workoutPlan", [])

            simplified_response = []
            for day_data in workout_plan:
                day = day_data.get("day", "Unknown Day")
                exercises = day_data.get("exercises", [])
                simplified_exercises = [
                    {
                        "name": exercise.get("name", "Unknown Exercise"),
                        "reps": exercise.get("reps", ""),
                        "url": exercise.get("url", "")
                    }
                    for exercise in exercises
                ]
                simplified_response.append({"day": day, "exercises": simplified_exercises})

            return jsonify(simplified_response)

        except json.JSONDecodeError as parse_error:
            app.logger.error(f"Error parsing response: {parse_error}")
            return jsonify({"error": "Failed to parse AI response."}), 500

    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)

