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
        <div>
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
                    workoutPlan.map((dayPlan, index) => (
                        <div key={index} className="day-plan">
                            <h3>{dayPlan.day}</h3>
                            <ul>
                                {dayPlan.exercises.map((exercise, idx) => {
                                    const { name, reps, url } = exercise;
                                    const isExpanded = expandedExercises[`${dayPlan.day}-${idx}`];

                                    return (
                                        <li
                                            key={idx}
                                            onClick={() => toggleExerciseDetails(dayPlan.day, idx)}
                                            className={`exercise-item ${isExpanded ? 'expanded' : ''}`}
                                        >
                                            <strong>{name}</strong>
                                            {isExpanded && (
                                                <>
                                                    <p className="exercise-details">{reps}</p>
                                                    {url && (
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="exercise-link"
                                                        >
                                                            View Exercise
                                                        </a>
                                                    )}
                                                </>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))
                ) : (
                    !error && !isLoading && <p>No workout plan available. Please submit an injury.</p>
                )}
            </div>
        </div>
    );
}

export default WorkoutPage;
