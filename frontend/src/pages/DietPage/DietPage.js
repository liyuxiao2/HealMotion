import React, { useState } from 'react';

function DietPage() {
    const [diet, setDiet] = useState([]);
    const [error, setError] = useState(null);

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

    return (
        <div>
            <h1>Diet Recommendations</h1>
            <button className="submit-button" onClick={handleFetchDiet}>
                Get Diet
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {diet.length > 0 ? (
                    diet.map((day, index) => (
                        <li key={index}>
                            <strong>{day.day}</strong>
                            <ul>
                                {day.meals.map((meal, i) => (
                                    <li key={i}>
                                        <strong>{meal.meal}:</strong>
                                        <ul>
                                            {meal.items.map((item, j) => (
                                                <li key={j}>{item}</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))
                ) : (
                    <p>No recommendations yet.</p>
                )}
            </ul>
        </div>
    );
}

export default DietPage;
