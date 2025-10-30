import React, { useState } from 'react';
import Modal from '../../components/modal';
import './DietPage.css';

function DietPage() {
    const [diet, setDiet] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null); // Track selected day for modal

    const handleFetchDiet = () => {
        setIsLoading(true);
        fetch('/api/diet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                injury: 'lower back pain',
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
                setIsLoading(false);
            });
    };

    const handleOpenModal = (day) => {
        setSelectedDay(day); // Open modal with selected day's details
    };

    const handleCloseModal = () => {
        setSelectedDay(null); // Close the modal
    };

    return (
        <div>
            <h1>Nutrition</h1>
            <button className="submit-button" onClick={handleFetchDiet}>
                Get Diet
            </button>
            {isLoading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="diet-plan-container">
                {diet.length > 0 ? (
                    diet.map((day, index) => (
                        <div
                            key={index}
                            className="day-plan"
                            onClick={() => handleOpenModal(day)}
                        >
                            <h3>{day.day}</h3>
                        </div>
                    ))
                ) : (
                    !error && !isLoading && <p></p>
                )}
            </div>
            {/* Modal */}
            <Modal
                isOpen={!!selectedDay}
                onClose={handleCloseModal}
                dayPlan={selectedDay}
            />
        </div>
    );
}

export default DietPage;
