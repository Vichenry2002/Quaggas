// App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/Landing";
import Register from "./components/Register";
import Discussions from "./components/CreateDiscussion";
import DashBoard from "./components/Dashboard"

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/discussions" element={< Discussions/>} />
                <Route path="/dashboard" element={<DashBoard />} />
            </Routes>
        </div>
    );
};

export default App;
