import React, { useState } from 'react';
import './Workout.css';
import injuries from '../injuries.json';

function WorkoutPage() {
    const [injury, setInjury] = useState('');
    const [workoutPlan, setWorkoutPlan] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [expandedExercises, setExpandedExercises] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Days of the week
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInjury(value);

        if (value) {
            const filteredSuggestions = injuries.filter((injury) =>
                injury.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInjury(suggestion);
        setSuggestions([]);
    };

    const handleSubmit = () => {
        if (!injuries.includes(injury.toLowerCase())) {
            setWorkoutPlan([]);
            setError('Please enter a valid injury.');
            return;
        }

        setIsLoading(true);
        setError(null);

        fetch('http://127.0.0.1:5000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ injury }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                    setWorkoutPlan([]);
                } else {
                    setWorkoutPlan(data); // Save the workout plan
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setError('Error fetching workout plan.');
                setWorkoutPlan([]);
            })
            .finally(() => {
                setIsLoading(false);
            });

        setSuggestions([]);
    };

    const toggleExerciseDetails = (day, index) => {
        setExpandedExercises((prev) => ({
            ...prev,
            [`${day}-${index}`]: !prev[`${day}-${index}`],
        }));
    };

    return (
        <div className="app-container">
            <h1>Workout Assistant</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter your injury"
                    value={injury}
                    onChange={handleInputChange}
                    className="input-field"
                />
                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="suggestion-item"
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button onClick={handleSubmit} className="submit-button">
                Submit
            </button>
            {isLoading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="workout-plan-container">
                {workoutPlan.length > 0 ? (
                    workoutPlan.map((dayPlan, index) => {
                        const dayKey = Object.keys(dayPlan)[0]; // Extract the day key (e.g., 1, 2, 3...)
                        const dayIndex = parseInt(dayKey, 10) - 1; // Convert day to 0-based index
                        const dayName = daysOfWeek[dayIndex]; // Map to day of the week
                        const exercises = dayPlan[dayKey]; // Get the exercises for that day

                        return (
                            <div key={index} className="day-plan">
                                <h3>{dayName}</h3>
                                <ul>
                                    {exercises.map((exercise, idx) => {
                                        const exerciseParts = exercise.split(" ");
                                        const exerciseName = exerciseParts.slice(0, -2).join(" ");
                                        const reps = exerciseParts.slice(-2, -1).join(" ");
                                        const url = exerciseParts.slice(-1)[0];
                                        const isExpanded = expandedExercises[`${dayKey}-${idx}`];

                                        return (
                                            <li
                                                key={idx}
                                                onClick={() => toggleExerciseDetails(dayKey, idx)}
                                                className={`exercise-item ${isExpanded ? 'expanded' : ''}`}
                                            >
                                                <strong>{exerciseName}</strong>
                                                {isExpanded && (
                                                    <>
                                                        <p className="exercise-details">{reps}</p>
                                                        <a href={url} target="_blank" rel="noopener noreferrer" className="exercise-link">
                                                            View Exercise
                                                        </a>
                                                    </>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })
                ) : (
                    !error && !isLoading && <p>No workout plan available. Please submit an injury.</p>
                )}
            </div>
        </div>
    );
}

export default WorkoutPage;
