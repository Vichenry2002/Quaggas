// components/Landing.js
import './Landing.css';
import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="header-content">
                <img src="/Quaggas.png" alt="Quaggas Logo" className="logo" />
            </div>
            <div className="description-content">
                <p>A dynamic discussion board for vibrant conversations</p>
            </div>

            <div className="form-wrapper">
                <form>
                    <div className="input-container">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" />
                    </div>
                    <div className="input-container">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" />
                    </div>
                </form>
                <div className="buttons-container">
                    <button type="submit">Login</button>
                    <Link to="/register" className="register-link">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
