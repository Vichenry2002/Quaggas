import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './DiscussionBoardCreate.css'; // Import your CSS file for styling

export default function DiscussionBoard() {
    const [form, setForm] = useState({
        title: "",
        users: [],
        admins: [],
        channels: []
    });

   //const navigate = useNavigate();

    function updateForm(value) {
        return setForm(prev => ({ ...prev, ...value }));
    }

    function handleArrayChange(value, field) {
        // Converts a comma-separated list into an array for admins, users, or channels
        const array = value.split(',').map(item => item.trim());
        updateForm({ [field]: array });
    }

    async function onSubmit(e) {
        e.preventDefault();
        const newBoard = { ...form };

        try {
            // Adding discussion to discussions collection
            let response = await fetch("http://localhost:8081/discussions/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newBoard),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const discussionData = await response.json();
            console.log(discussionData);
            const discussionId = discussionData.insertedId; // Assuming the ID is returned in the response
            const discussionTitle = form.title;
            console.log(discussionId);

            // Adding discussion to user collection
            const userId = "vhenry_test1"; // Replace with actual user ID (from auth context or similar)
            await fetch(`http://localhost:8081/user/${userId}/addDiscussion`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ discussionId , discussionTitle}),
            });
            setForm({ title: "", users: [], admins: [], channels: [] });
        } catch (error) {
            console.log("Error:", error);
            window.alert(error);
        }
    }

    return (
        <div className="discussion-board-create-page">
            <h2>Create a New Discussion Board</h2>
            <form onSubmit={onSubmit}>
                <div className="input-container">
                    <label htmlFor="title">Title:</label>
                    <input 
                        type="text"
                        id="title"
                        value={form.title}
                        onChange={(e) => updateForm({ title: e.target.value })}
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="users">Users (comma-separated):</label>
                    <input 
                        type="text"
                        id="users"
                        value={form.users.join(", ")}
                        onChange={(e) => handleArrayChange(e.target.value, 'users')}
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="admins">Admins (comma-separated):</label>
                    <input 
                        type="text"
                        id="admins"
                        value={form.admins.join(", ")}
                        onChange={(e) => handleArrayChange(e.target.value, 'admins')}
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="channels">Channels (comma-separated):</label>
                    <input 
                        type="text"
                        id="channels"
                        value={form.channels.join(", ")}
                        onChange={(e) => handleArrayChange(e.target.value, 'channels')}
                    />
                </div>
                <button type="submit">Create Discussion Board</button>
            </form>
        </div>
    );
}
