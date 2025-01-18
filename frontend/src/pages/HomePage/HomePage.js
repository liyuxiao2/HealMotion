import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Adjust the path as necessary

const HomePage = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to Mendify</h1>
                <p>Your personal guide to fitness and rehabilitation.</p>
            </header>
            <main className="home-main">
                <div className="category-grid">
                    <Link to="/profile" className="category-card">
                        <h2>Profile</h2>
                        <p>Set up your personal information and fitness goals.</p>
                    </Link>
                    <Link to="/Workout" className="category-card">
                        <h2>Workout</h2>
                        <p>Find personalized workout plans for rehabilitation and training.</p>
                    </Link>
                    <Link to="/diet" className="category-card">
                        <h2>Diet</h2>
                        <p>Get diet recommendations tailored to your needs.</p>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
