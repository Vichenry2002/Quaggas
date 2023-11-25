import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DiscussionsPopUp from './CreateDiscussion'; // Import your DiscussionsPopUp component
import './Dashboard.css';


/*
Upon creation, a discussion is added to the discussions collection. Further, the id of the collection and its title are stored as a tuple in the user collection.
Upon initialization of the dashboard, a get request is sent to the discussion field of the user's collection. 
Leave discussion done.
Now work on adding admins/users
 */

export default function UserDashboard() {
    const [userDiscussions, setUserDiscussions] = useState([]);
    const [isPopUpOpen, setPopUpOpen] = useState(false); // State for managing the pop-up
    const userId = "vhenry_test1"; // Replace with actual user ID (from auth or context)
    const navigate = useNavigate();

    const navigateToDiscussion = (discussionId) => {
        navigate(`/discussion/${discussionId}`);
    };

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

    const handleLeaveDiscussion = async (discussionId) => {
        console.log("Leave discussion", discussionId);
        try {
            // Assuming 'discussionTitle' is available in this scope, 
            // if not, you need to ensure it is passed to this function or retrieved from state
            const discussionTitle = "Some discussion title"; // Placeholder

            console.log("TEST: " + discussionId);
    
            //delete from user list of discussions
            await fetch(`http://localhost:8081/user/${userId}/${discussionId}/remove`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            //delete from discussion list of users
            await fetch(`http://localhost:8081/discussion/${discussionId}/${userId}/remove`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            // Update the local state to reflect the change
            deleteDiscussion(discussionId);
        } catch (error) {
            console.error("Error leaving discussion:", error);
        }
    };
    

    const handleDeleteDiscussion = (discussionId) => {
        console.log("Delete discussion", discussionId);
        // Implement delete discussion logic here
    };

    const togglePopUp = () => {
        // Toggle the pop-up modal
        setPopUpOpen(!isPopUpOpen);
    };

    const addNewDiscussion = (newDiscussion) => {
        setUserDiscussions(prevDiscussions => [...prevDiscussions, newDiscussion]);
    };

    const deleteDiscussion = (discussionId) => {
        setUserDiscussions(prevDiscussions => prevDiscussions.filter(discussion => discussion.discussionId !== discussionId));
    };
    

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Welcome to your Dashboard</h1>
                <button className="create-button" onClick={togglePopUp}>Create</button>
            </div>
            <ul className="discussion-list">
                {userDiscussions && userDiscussions.map((discussion, index) => (
                    <li 
                        key={index} 
                        className="discussion-item" 
                        onClick={() => navigateToDiscussion(discussion.discussionId)}
                        // Add any required styling here to make it look clickable
                        style={{ cursor: 'pointer' }} 
                    >
                        <span>{discussion.title}</span>
                        <div>
                            <button className="button" onClick={(e) => {
                                e.stopPropagation(); // Prevents click from bubbling up to the li element
                                handleAddDiscussion(discussion.discussionId);
                            }}>Add Users</button>
                            <button className="button" onClick={(e) => {
                                e.stopPropagation(); // Prevents click from bubbling up to the li element
                                handleLeaveDiscussion(discussion.discussionId);
                            }}>Leave</button>
                            <button className="button" onClick={(e) => {
                                e.stopPropagation(); // Prevents click from bubbling up to the li element
                                handleDeleteDiscussion(discussion.discussionId);
                            }}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            
            {isPopUpOpen && (
            <DiscussionsPopUp 
                isOpen={isPopUpOpen} 
                onRequestClose={togglePopUp} 
                addNewDiscussion={addNewDiscussion} // Passing the function as a prop
            />
             )}
        </div>
    );
}