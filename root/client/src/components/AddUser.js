import React, { useState } from 'react';
import Modal from 'react-modal';
import './AddUser.css';

const AddUser = ({ discussionId, discussionTitle }) => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('user'); // Default role is 'user'


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(username);
        console.log(role);

        // Validate username input
        if (!username) {
            window.alert('Please enter a username.');
            return;
        }

        // make a PUT request to add the discussion to the user's discussions
        const discussionData = {
            discussionId, // The discussion ID you want to add
            discussionTitle: discussionTitle, // Replace with the actual discussion title
            role, // Include the selected role in the request
        };

        const addUserToDiscussionResponse = await fetch(`http://localhost:8081/user/${username}/addDiscussion`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(discussionData),
        });

        if (addUserToDiscussionResponse.ok) {
            // Discussion added to user's discussions successfully
            console.log(`Discussion added to user's discussions.`);
        } else {
            // Handle error response from the API
            window.alert("User does not exist or is already in the discussion");
            console.error('Failed to add discussion to user:', addUserToDiscussionResponse.statusText);
        }
        
        if(addUserToDiscussionResponse.ok){
            try {
                if(role === 'admin'){
                    //Make a POST request to add admin to discussion
                    const response_admin = await fetch(`http://localhost:8081/discussion/${discussionId}/addAdmin/${username}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
    
                    if (response_admin.ok) {
                        // Discussion added to user's discussions successfully
                        console.log(`Admin added to discussion.`);
                    } else {
                        // Handle error response from the API
                        window.alert('Failed to add admin to discussion. Please try again.');
                        console.error('Failed to add admin to discussion:', response_admin.statusText);
                    }
    
                    
                }
    
                // Make a POST request to the API endpoint to add the user to the discussion
                const response = await fetch(`http://localhost:8081/discussion/${discussionId}/addUser/${username}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
            } catch (error) {
                window.alert('Failed to add user to discussion. Please try again.');
                console.error('Error adding user or discussion:', error);
            }
    
        }

        setUsername("");
    };

    return (
        <div className="discussion-board-create-page">
            <h2 className="title-text">Add User to Discussion: <span className="discussion-name">{discussionTitle}</span></h2>
            <form onSubmit={handleSubmit} >
                <div className="form-container">
                    <label htmlFor="user">Username:</label>
                    <input className ="user-field"
                        type="text"
                        id="title"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        className='role-button'
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Add User</button>
            </form>
        </div>
    );
};

export default AddUser;
