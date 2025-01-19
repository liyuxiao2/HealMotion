import React, { useState } from 'react';
import './App.css';
import WorkoutPage from './WorkoutPage/WorkoutPage';
import ProfilePage from './ProfilePage/ProfilePage';
import DietPage from './DietPage/DietPage';
import HomePage from './HomePage/HomePage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    return (
        <Router>
            <div className="app-container">
                <button className="menu-toggle" onClick={toggleSidebar}>
                    ☰
                </button>
                <div className={`sidebar ${isSidebarVisible ? 'visible' : 'hidden'}`}>
                    <h2>HealMotion</h2>
                    <ul>
                        <li><Link to="/" onClick={toggleSidebar}>Home</Link></li>
                        <li><Link to="/profile" onClick={toggleSidebar}>Profile</Link></li>
                        <li><Link to="/Workout" onClick={toggleSidebar}>Workout Assistant</Link></li>
                        <li><Link to="/diet" onClick={toggleSidebar}>Nutrition</Link></li>
                    </ul>
                </div>
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/Workout" element={<WorkoutPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/diet" element={<DietPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
