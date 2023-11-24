// App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/Landing";
import Register from "./components/Register";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
};

export default App;
