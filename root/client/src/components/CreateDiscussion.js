import React, { useState } from 'react';
//import './DiscussionBoardCreate.css'; // Import your CSS file for styling

export default function DiscussionBoard({ isOpen, onRequestClose, addNewDiscussion }) {
    //TODO: Replace with actual user ID (from auth context or similar)
    const userId = sessionStorage.getItem("username");
    const domainName = 'http://localhost:8081';

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


    async function onSubmit(e) {
        e.preventDefault();
        const updatedUsers = [...form.users, userId]; // Append userId to the users array
        const updatedAdmins = [...form.admins, userId];

        const createChannel = {
            name: 'main', 
            posts: []
          };

        

        try {

            //creating channel in channel discussion
            let response_1 = await fetch(domainName+"/channel/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createChannel),
            });

            let data = await response_1.json();
            let channelId = data.channelId;

            console.log('Channel ID:', channelId);
        

            const newBoard = {
                ...form,
                users: updatedUsers,
                admins: updatedAdmins,
                channels: [channelId]
            };

            // Adding discussion to discussions collection
            let response = await fetch(domainName+"/discussions/add", {
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

            const newDiscussion = {
                discussionId: discussionData.insertedId.toString(),
                title: form.title,
            };

            addNewDiscussion(newDiscussion);
            onRequestClose();

            const discussionId = discussionData.insertedId; // Assuming the ID is returned in the response
            const discussionTitle = form.title;
            


            // Adding discussion to user collection
            await fetch(domainName+`/user/${userId}/addDiscussion`, {
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
                <button type="submit">Create Discussion Board</button>
            </form>
        </div>
    );
}
