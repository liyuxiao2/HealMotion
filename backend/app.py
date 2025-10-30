from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
import re

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("API key not found. Ensure GEMINI_API_KEY is set in your .env file.")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("models/gemini-2.5-flash-lite")

user_profiles = {}

# Pydantic models
class ProfileData(BaseModel):
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    sex: Optional[str] = None
    severity: Optional[str] = None

class InjuryRequest(BaseModel):
    injury: str

@app.post('/profile')
async def update_profile(profile: ProfileData, request: Request):
    try:
        user_id = request.client.host
        user_profiles[user_id] = profile.dict()
        print("Received profile data:", profile.dict())
        print("Stored profile data for user:", user_profiles[user_id])
        return {"message": "Profile updated successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/analyze')
async def analyze_injury(injury_request: InjuryRequest, request: Request):
    try:
        injury = injury_request.injury

        if not injury:
            raise HTTPException(status_code=400, detail="No injury provided")

        # Retrieve profile data
        user_id = request.client.host
        profile_data = user_profiles.get(user_id, {})

        if not isinstance(profile_data, dict):
            print(f"Invalid profile data for user {user_id}: {profile_data}")
            raise HTTPException(status_code=500, detail="Invalid profile data.")

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
            "              - 'url': A URL to a google search for additional information."
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

        return simplified_response

    except json.JSONDecodeError as parse_error:
        print(f"Error parsing response: {parse_error}")
        raise HTTPException(status_code=500, detail="Failed to parse AI response.")
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post('/diet')
async def analyze_diet(injury_request: InjuryRequest, request: Request):
    try:
        injury = injury_request.injury

        if not injury:
            raise HTTPException(status_code=400, detail="No injury provided")

        # Retrieve profile data
        user_id = request.client.host
        profile_data = user_profiles.get(user_id, {})

        if not isinstance(profile_data, dict):
            print(f"Invalid profile data for user {user_id}: {profile_data}")
            raise HTTPException(status_code=500, detail="Invalid profile data.")

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

        return simplified_response

    except json.JSONDecodeError as parse_error:
        print(f"Error parsing response: {parse_error}")
        raise HTTPException(status_code=500, detail="Failed to parse AI response.")
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Vercel serverless function handler
handler = app
