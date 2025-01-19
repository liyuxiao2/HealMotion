import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Adjust the path as necessary

const HomePage = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Welcome to HealMotion</h1>
                <p>Your personal guide to fitness and rehabilitation.</p>
            </header>
            <main className="home-main">
                <div className="category-grid">
                    <Link to="/profile" className="category-card">
                        <h2>Profile</h2>
                    </Link>
                    <Link to="/Workout" className="category-card">
                        <h2>Workout</h2>
                    </Link>
                    <Link to="/diet" className="category-card">
                        <h2>Diet</h2>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default HomePage;