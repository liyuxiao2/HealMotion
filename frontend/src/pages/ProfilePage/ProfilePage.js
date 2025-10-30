import React, { useState } from 'react';
import './ProfilePage.css';

function ProfilePage() {
    const [profile, setProfile] = useState({
        age: '',
        weight: '',
        height: '',
        sex: '',
        severity: '',
        fitnessGoals: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        try {
            // Filter out empty values
            const filteredProfile = Object.fromEntries(
                Object.entries(profile).filter(([_, value]) => value !== '')
            );

            const response = await fetch('http://127.0.0.1:8000/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filteredProfile),
            });

            const result = await response.json();

            console.log(result.message);
        } catch (error) {
            console.log('ERROR', error);
        }
    };

    return (
        <div className="profile-container">
            <h1 className="profile-header">Profile Page</h1>
            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={profile.age}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="weight">Weight (kg):</label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={profile.weight}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="height">Height (cm):</label>
                    <input
                        type="number"
                        id="height"
                        name="height"
                        value={profile.height}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Sex:</label>
                    <div className="checkbox-form-container">
                        <label className="checkbox-container">
                            <input
                                type="radio"
                                id="male"
                                name="sex"
                                value="Male"
                                checked={profile.sex === "Male"}
                                onChange={handleChange}
                            />
                            <span className="custom-checkbox">Male</span>
                        </label>
                        <label className="checkbox-container">
                            <input
                                type="radio"
                                id="female"
                                name="sex"
                                value="Female"
                                checked={profile.sex === "Female"}
                                onChange={handleChange}
                            />
                            <span className="custom-checkbox">Female</span>
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label>Severity:</label>
                    <div className="checkbox-form-container">
                        <label className="checkbox-container">
                            <input
                                type="radio"
                                id="high"
                                name="severity"
                                value="High"
                                checked={profile.severity === "High"}
                                onChange={handleChange}
                            />
                            <span className="custom-checkbox">High</span>
                        </label>
                        <label className="checkbox-container">
                            <input
                                type="radio"
                                id="medium"
                                name="severity"
                                value="Medium"
                                checked={profile.severity === "Medium"}
                                onChange={handleChange}
                            />
                            <span className="custom-checkbox">Medium</span>
                        </label>
                        <label className="checkbox-container">
                            <input
                                type="radio"
                                id="low"
                                name="severity"
                                value="Low"
                                checked={profile.severity === "Low"}
                                onChange={handleChange}
                            />
                            <span className="custom-checkbox">Low</span>
                        </label>
                    </div>
                </div>
                <button className="submit-button" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default ProfilePage;
