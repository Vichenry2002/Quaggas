import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import Landing2Page from "./components/Landing";
import Register from "./components/Register";
import DashBoard from "./components/Dashboard"
import Discussion from "./components/Discussion";


const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Landing2Page />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/discussion/:id" element={<Discussion />} />
            </Routes>
        </div>
    );
};

export default App;
