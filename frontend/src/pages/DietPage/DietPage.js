import React, { useState } from 'react';

function DietPage() {
    const [diet, setDiet] = useState([]);

    const handleFetchDiet = () => {
        // Fetch diet recommendations from the backend or Gemini API
        fetch('http://127.0.0.1:5000/diet') // Replace with your backend endpoint
            .then((res) => res.json())
            .then((data) => setDiet(data))
            .catch((error) => console.error('Error fetching diet:', error));
    };

    return (
        <div>
            <h1>Diet Recommendations</h1>
            <button class="submit-button" onClick={handleFetchDiet}>Get Diet</button>
            <ul>
                {diet.length > 0 ? (
                    diet.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))
                ) : (
                    <p>No recommendations yet.</p>
                )}
            </ul>
        </div>
    );
}

export default DietPage;
