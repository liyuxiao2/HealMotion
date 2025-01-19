import React, { useState } from 'react';
import './DietPage.css';

function DietPage() {
    const [diet, setDiet] = useState([]);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    const handleFetchDiet = () => {
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
            });
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    const closeModal = () => {
        setSelectedDay(null);
    };

    return (
        <div className="diet-page">
            <h1>Diet Recommendations</h1>
            <button className="fetch-button" onClick={handleFetchDiet}>
                Get Diet
            </button>
            {error && <div className="error-message">{error}</div>}
            <div className="diet-container">
                {diet.length > 0 ? (
                    diet.map((day, index) => (
                        <div
                            key={index}
                            className="diet-day"
                            onClick={() => handleDayClick(day)}
                        >
                            {day.day}
                        </div>
                    ))
                ) : (
                    <div className="error-message">No recommendations yet.</div>
                )}
            </div>
            {selectedDay && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>
                            &times;
                        </button>
                        <h3>{selectedDay.day}</h3>
                        {selectedDay.meals.map((meal, i) => (
                            <div key={i}>
                                <h4>{meal.meal}</h4>
                                <ul>
                                    {meal.items.map((item, j) => (
                                        <li key={j}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DietPage;
