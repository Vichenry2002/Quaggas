// App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Landing2Page from "./components/Landing";
import Register from "./components/Register";
import Create from "./components/CreateDiscussion";
import DashBoard from "./components/Dashboard"
import Discussion from "./components/Discussion";


const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Landing2Page />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create" element={< Create/>} />
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/discussion" element={<Discussion />} />
            </Routes>
        </div>
    );
};

export default App;
