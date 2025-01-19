import React, { useState } from 'react';
import './DietPage.css';

function DietPage() {
    const [diet, setDiet] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Track loading state

    const handleFetchDiet = () => {
        setIsLoading(true); // Start loading
        fetch('http://127.0.0.1:5000/diet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                injury: 'lower back pain', // Example injury; replace with actual user input
            }),
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
                    setDiet([]);
                } else {
                    setError(null);
                    setDiet(data);
                }
            })
            .catch((err) => {
                console.error('Error fetching diet:', err);
                setError('Failed to fetch diet recommendations.');
            })
            .finally(() => {
                setIsLoading(false); // End loading
            });
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const closeModal = () => {
        setSelectedDay(null);
    };

    return (
        <div>
            <h1>Nutrition</h1>
            <button className="submit-button" onClick={handleFetchDiet}>
                Get Diet
            </button>
            {isLoading && <p className="loading-text">Loading...</p>} {/* Show loading message */}
            {error && <p className="error-message">{error}</p>}
            <div className="diet-plan-container">
                {diet.length > 0 ? (
                    diet.map((day, index) => (
                        <div key={index} className="day-plan">
                            <h3>{day.day}</h3>
                            <ul>
                                {day.meals.map((meal, i) => (
                                    <li key={i}>
                                        <strong>{meal.meal}:</strong>
                                        <ul>
                                            {meal.items.map((item, j) => (
                                                <li key={j} className="meal-details">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    !error && !isLoading && <p>No recommendations yet.</p>
                )}
            </div>
        </div>
    );
}

export default DietPage;
