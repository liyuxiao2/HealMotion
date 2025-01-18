import React, { useState, useEffect } from 'react';
import './App.css';
import injuries from './injuries.json';

function App() {
    const [injury, setInjury] = useState('');
    const [workoutPlan, setWorkoutPlan] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);
    const [expandedExercises, setExpandedExercises] = useState({});

    const daysOfWeekOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
        setSuggestions([]);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInjury(value);

        if (value) {
            const filteredSuggestions = injuries.filter((injury) =>
                injury.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions.slice(0, 5)); // Limit to 5 suggestions
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

        fetch('http://127.0.0.1:5000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ injury }),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setWorkoutPlan([]);
                } else {
                    const workoutPlanData = data[0];
                    const sortedWorkoutPlan = Object.entries(workoutPlanData).sort(
                        ([dayA], [dayB]) =>
                            daysOfWeekOrder.indexOf(dayA) - daysOfWeekOrder.indexOf(dayB)
                    );

                    setWorkoutPlan(sortedWorkoutPlan);
                    setError(null);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setError('Error fetching workout plan.');
                setWorkoutPlan([]);
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
            <button onClick={handleSubmit} className="submit-button">Submit</button>
            {error && <p className="error-message">{error}</p>}
            <div className="workout-plan-container">
                {workoutPlan.length > 0 ? (
                    workoutPlan.map(([day, exercises], index) => (
                        <div key={index} className="day-plan">
                            <h3>{day}</h3>
                            <ul>
                                {exercises.map((exercise, idx) => {
                                    const [exerciseName, ...details] = exercise.split(" ");
                                    const detailsText = details.join(" ");
                                    const isExpanded = expandedExercises[`${day}-${idx}`];

                                    return (
                                        <li
                                            key={idx}
                                            onClick={() => toggleExerciseDetails(day, idx)}
                                            className={`exercise-item ${isExpanded ? 'expanded' : ''}`}
                                        >
                                            <strong>{exerciseName}</strong>
                                            {isExpanded && (
                                                <p className="exercise-details">{detailsText}</p>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))
                ) : (
                    !error && <p>No workout plan available. Please submit an injury.</p>
                )}
            </div>
        </div>
    );
}

export default App;