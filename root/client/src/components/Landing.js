// components/Landing.js
import './Landing.css';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
const bcrypt = require('bcryptjs');
const saltRounds=10;
const secretPass = "WfgHyiosyGH";

const LandingPage = () => {
    const navigate=useNavigate();
    const [form, setForm] = useState({
        username: "",
        hashedpswd: "",

    });
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    async function onSubmit(e) {

        e.preventDefault();
        // When a post request is sent to the Auth url, we'll check with the DB.
        let psraw=form.hashedpswd;
        const ps=await bcrypt.hash(psraw,saltRounds);
        const usr=form.username;
        const newPerson={"username": usr, "hashedpswd": psraw}
        var ticket =await fetch("http://localhost:8081/record/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPerson),
        })
            .catch(error => {
                window.alert("Wrong username or password");
                setForm({ username: "", hashedpswd: "" });
                return;
            });

            let encryptedData = await ticket.json()
            if (encryptedData!="err") {
                console.log(encryptedData);
                const decryptedData = CryptoJS.AES.decrypt(encryptedData, secretPass);
                const data = decryptedData.toString(CryptoJS.enc.Utf8);
                sessionStorage.setItem("time", data);
                const expirey = new Date(data);
                const current = new Date(Date.now());
                console.log(expirey.toString());
                console.log(current.toString());
                if (expirey > current) {
                    sessionStorage.setItem('username', usr);
                    return navigate("/register")
                } else {
                    console.log(sessionStorage.getItem("username"))
                    setForm({username: "", hashedpswd: ""});
                }
            }


            else {
                window.alert("Wrong username or password");
                setForm({ username: "", hashedpswd: "" });
                return;
            }
    }
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
                        <input
                            type="text"
                            id="username"
                            value={form.username}
                            onChange={(e) => updateForm({ username: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="hashedpswd"
                            value={form.hashedpswd}
                            onChange={(e) => updateForm({ hashedpswd: e.target.value })}
                        />
                    </div>
                </form>
                <div className="buttons-container">
                    <button type="submit" onClick={onSubmit}>Login</button>
                    <Link to="/register" className="register-link">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
