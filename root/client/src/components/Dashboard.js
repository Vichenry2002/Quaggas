import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Import Modal from 'react-modal'
import DiscussionsPopUp from './CreateDiscussion'; // Import your DiscussionsPopUp component
import './Dashboard.css';

Modal.setAppElement('#root'); // Set the app element for the modal for accessibility

export default function UserDashboard() {
    const [userDiscussions, setUserDiscussions] = useState([]);
    const [isPopUpOpen, setPopUpOpen] = useState(false); // State for managing the pop-up
    const userId = sessionStorage.getItem("username"); // Replace with actual user ID (from auth or context)
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
    

    const handleAddChannelsDiscussion = (discussionId) => {
        console.log("add channel", discussionId);
        // Implement delete discussion logic here
    };

    const togglePopUp = () => {
        setPopUpOpen(!isPopUpOpen);
    };

    const addNewDiscussion = (newDiscussion) => {
        console.log("Adding new discussion:", newDiscussion);
        
    
        // Update the state immediately with the new discussion
        setUserDiscussions(prevDiscussions => [...prevDiscussions, newDiscussion]);
    };
    


    const deleteDiscussion = (discussionId) => {
        setUserDiscussions(prevDiscussions => prevDiscussions.filter(discussion => discussion.discussionId !== discussionId));
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%', // Adjust the width as needed
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            background: '#fff'
        },
        overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)' // Semi-transparent overlay
        }
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
                                handleAddChannelsDiscussion(discussion.discussionId);
                            }}>Add Channels</button>
                            <button className="button" onClick={(e) => {
                                e.stopPropagation(); // Prevents click from bubbling up to the li element
                                handleLeaveDiscussion(discussion.discussionId);
                            }}>Leave</button>
                        </div>
                    </li>
                ))}
            </ul>
            
            <Modal
                isOpen={isPopUpOpen}
                onRequestClose={togglePopUp}
                style={customStyles}
                // Style your modal here or in the CSS file
            >
                <DiscussionsPopUp 
                    isOpen={isPopUpOpen} 
                    
                    onRequestClose={togglePopUp} 
                    addNewDiscussion={addNewDiscussion}
                />
            </Modal>
        </div>
    );
}