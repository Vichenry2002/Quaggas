import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Register.css';
const bcrypt = require('bcryptjs');
const saltRounds=10;

export default function Create() {
    const domainName = 'https://fall2023-comp307-group11.cs.mcgill.ca/api';
    const [form, setForm] = useState({
        user_id: "",
        hashedpswd: "",
        discussions: []
    });
    const navigate = useNavigate();
    // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();
        // When a post request is sent to the create url, we'll add a new record to the database.
        const newPerson = { ...form };
        const ps=await bcrypt.hash(newPerson.hashedpswd,saltRounds);
        newPerson.hashedpswd= ps;
        var response = await fetch(domainName+"record/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPerson),
        })
            .catch(error => {
                window.alert("username taken");
                setForm({ username: "", hashedpswd: "" });
                return;
            });
            var res= await response.json();
            console.log("here");
            if(res!="err"){
                console.log("a bit further");
                return navigate("/");

            }
            else{
                window.alert("username taken");
                setForm({ username: "", hashedpswd: "" });
                return;
            }

    }
    // This following section will display the form that takes the input from the user.
    return (
        <div className="register-page">
            <div className="header-content">
                <img src="/Quaggas.png" alt="Quaggas Logo" className="logo" />
            </div>
            <div className="description-content">
                <p>Join our community to start discussions!</p>
            </div>
            <div className="form-wrapper">
                <form onSubmit={onSubmit}>
                    <div className="input-container">
                        <label htmlFor="user_id">Username:</label>
                        <input
                            type="text"
                            id="user_id"
                            value={form.user_id}
                            onChange={(e) => updateForm({ user_id: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="hashedpswd">Password:</label>
                        <input
                            type="password"
                            id="hashedpswd"
                            value={form.hashedpswd}
                            onChange={(e) => updateForm({ hashedpswd: e.target.value })}
                        />
                    </div>
                    <div className="buttons-container">
                        <button type="submit">
                            Register
                        </button>
                    </div>
                    <div className="account-link">
                            <Link to="/">Already have an account?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}