import React, { useState, useEffect } from 'react';
import './App.css';
import injuries from './injuries.json';

function App() {
    const [injury, setInjury] = useState('');
    const [workoutPlan, setWorkoutPlan] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setSuggestions(injuries);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInjury(value);
    };

    const handleSubmit = () => {
        if (!injuries.includes(injury.toLowerCase())) {
            setWorkoutPlan(["Error: Injury not recognized."]);
            return;
        }

        fetch('http://localhost:5000/analyze', {
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
                    setWorkoutPlan(data.workoutPlan);
                    setError(null);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setError('Error fetching workout plan.');
                setWorkoutPlan([]);
            });
    };

    return (
        <div className="app-container">
            <h1>Injury Analysis Dashboard</h1>
            <input
                type="text"
                placeholder="Enter your injury"
                value={injury}
                onChange={handleInputChange}
                className="input-field"
            />
            <button onClick={handleSubmit} className="submit-button">Submit</button>
            {error && <p className="error-message">{error}</p>}
            <div className="workout-plan-container">
                {workoutPlan.length > 0 && (
                    <div>
                        {workoutPlan.map((dayPlan, index) => (
                            <div key={index} className="day-plan">
                                <h3>Day {index + 1}</h3>
                                <p>{dayPlan}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;