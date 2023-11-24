import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DiscussionsPopUp from './DiscussionsPopUp'; // Import your DiscussionsPopUp component


/*
Upon creation, a discussion is added to the discussions collection. Further, the id of the collection and its title are stored as a tuple in the user collection.
Upon initialization of the dashboard, a get request is sent to the discussion field of the user's collection. 

Next steps: 
link leave button to delete for user
create add user pop up and back end / make it white out if not admin
same for delete ^^

 */

export default function UserDashboard() {
    const [userDiscussions, setUserDiscussions] = useState([]);
    const [isPopUpOpen, setPopUpOpen] = useState(false); // State for managing the pop-up
    const userId = "vhenry_test1"; // Replace with actual user ID (from auth or context)
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserDiscussions();
    }, []);

    const fetchUserDiscussions = async () => {
        try {
            const response = await fetch(`http://localhost:8081/user/${userId}/discussions`);
            const userData = await response.json();
            
            if (userData && Array.isArray(userData)) {
                setUserDiscussions(userData);
            } else {
                console.error("Invalid or no data for user discussions");
                setUserDiscussions([]);
            }
        } catch (error) {
            console.error("Error fetching user discussions:", error);
        }
    };

    const handleAddDiscussion = (discussionId) => {
        console.log("Add to discussion", discussionId);
        // Implement add to discussion logic here
    };

    const handleLeaveDiscussion = (discussionId) => {
        console.log("Leave discussion", discussionId);
        // Implement leave discussion logic here
    };

    const togglePopUp = () => {
        // Toggle the pop-up modal
        setPopUpOpen(!isPopUpOpen);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>User's Discussions</h1>
                <button onClick={togglePopUp}>Create</button>
            </div>
            <ul>
                {userDiscussions && userDiscussions.map((discussion, index) => (
                    <li key={index}>
                        {discussion.title}
                        <button onClick={() => handleAddDiscussion(discussion.id)}>Add</button>
                        <button onClick={() => handleLeaveDiscussion(discussion.id)}>Leave</button>
                    </li>
                ))}
            </ul>
            
            {/* Conditionally render the pop-up modal */}
            {isPopUpOpen && <DiscussionsPopUp isOpen={isPopUpOpen} onRequestClose={togglePopUp} />}
        </div>
    );
}
