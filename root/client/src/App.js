// App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/Landing";
import Create from "./components/Register";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/create" element={<Create />} />
            </Routes>
        </div>
    );
};

export default App;
