import React from 'react';
import './modal.css';

function Modal({ isOpen, onClose, dayPlan }) {
    if (!isOpen) return null; // Do not render if modal is not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>{dayPlan.day}</h2>
                <ul>
                    {dayPlan.meals.map((meal, i) => (
                        <li key={i}>
                            <strong>{meal.meal}</strong>
                            <ul>
                                {meal.items.map((item, j) => (
                                    <li key={j}>{item}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Modal;
