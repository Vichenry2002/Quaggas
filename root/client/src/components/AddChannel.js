import React, { useState } from 'react';
import Modal from 'react-modal';
import './AddUser.css';

const AddChannel = ({ discussionId, discussionTitle }) => {
    const [channel, setChannel] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(channel);

        // Validate username input
        if (!channel) {
            window.alert('Please enter a channel name.');
            return;
        }

        const addChannelToDiscussionResponse = await fetch(`http://localhost:8081/discussions/${discussionId}/${channel}/addChannel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (addChannelToDiscussionResponse.ok) {
            // Discussion added to user's discussions successfully
            console.log(`Channel added to discussion.`);
        } else {
            // Handle error response from the API
            window.alert("Error adding channel to discussion");
            console.error('Failed to add discussion to user:', addChannelToDiscussionResponse.statusText);
        }

       setChannel("");
    };

    return (
        <div className="discussion-board-create-page">
            <h2 className="title-text">Add Channel to Discussion: <span className="discussion-name">{discussionTitle}</span></h2>
            <form onSubmit={handleSubmit} >
                <div className="form-container">
                    <label htmlFor="user">Channel name:</label>
                    <input className ="user-field"
                        type="text"
                        id="title"
                        value={channel}
                        onChange={(e) => setChannel(e.target.value)}
                    />
                </div>
                <button type="submit">Add Channel</button>
            </form>
        </div>
    );
};

export default AddChannel;
