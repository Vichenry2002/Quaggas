import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Import Modal from 'react-modal'
import DiscussionsPopUp from './CreateDiscussion'; // Import your DiscussionsPopUp component
import './Dashboard.css';
import AddUser from './AddUser';
import AddChannel from './AddChannel';

Modal.setAppElement('#root'); // Set the app element for the modal for accessibility

export default function UserDashboard() {
    const domainName = 'http://localhost:8081';

    const [isAddUserPopupOpen, setIsAddUserPopupOpen] = useState(false);
    const [isAddChannelPopupOpen, setIsAddChannelPopupOpen] = useState(false);
    const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);
    const [selectedDiscussionTitle, setSelectedDiscussionTitle] = useState(null);

    const handleOpenAddUserPopup = (discussionId, discussionTitle) => {
        setSelectedDiscussionId(discussionId);
        setSelectedDiscussionTitle(discussionTitle);
        setIsAddUserPopupOpen(true);
    };

    const handleOpenAddChannelPopup = (discussionId, discussionTitle) => {
        setSelectedDiscussionId(discussionId);
        setSelectedDiscussionTitle(discussionTitle);
        setIsAddChannelPopupOpen(true);
    };


    const [userDiscussions, setUserDiscussions] = useState([]);
    const [isPopUpOpen, setPopUpOpen] = useState(false); // State for managing the pop-up
    const userId = sessionStorage.getItem("username"); // Replace with actual user ID (from auth or context)
    const navigate = useNavigate();

    if (userId === "" || userId === null){
        setTimeout(() => {
            navigate("/");
        }, 0);
    }

    const navigateToDiscussion = (discussionId) => {
        navigate(`/discussion/${discussionId}`);
    };

    const checkAdminStatus = async (discussionId) => {
        try {
            const response = await fetch(domainName+`/discussion/${discussionId}/isAdmin/${userId}`);
            const isAdminData = await response.json();

            if (isAdminData) {
                return isAdminData.isAdmin;
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
        }
    };

    useEffect(() => {
        fetchUserDiscussions();
    }, []);

    const fetchUserDiscussions = async () => {
        try {
            const response = await fetch(domainName+`/user/${userId}/discussions`);
            const userData = await response.json();
            
            if (userData && Array.isArray(userData)) {
                // Fetch the admin status for each discussion
                const discussionsWithAdminStatus = await Promise.all(
                    userData.map(async (discussion) => {
                        const isAdmin = await checkAdminStatus(discussion.discussionId);
                        return { ...discussion, isAdmin };
                    })
                );
                setUserDiscussions(discussionsWithAdminStatus);
                console.log(discussionsWithAdminStatus);
            } else {
                console.error("Invalid or no data for user discussions");
                setUserDiscussions([]);
            }
        } catch (error) {
            console.error("Error fetching user discussions:", error);
        }
    };

    const handleLeaveDiscussion = async (discussionId) => {
        console.log("Leave discussion", discussionId);
        try {
    
            //delete from user list of discussions
            await fetch(domainName+`/user/${userId}/${discussionId}/remove`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            //delete from discussion list of users
            await fetch(domainName+`/discussion/${discussionId}/${userId}/remove`, {
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

    const handleLogout = () => {
        sessionStorage.setItem("username", "");
        navigate("/");
    };

    const togglePopUp = () => {
        setPopUpOpen(!isPopUpOpen);
    };

    const addNewDiscussion = (newDiscussion) => {
        console.log("Adding new discussion:", newDiscussion);
        
        try {
            // Check if the current user is an admin for the newly added discussion
            const isAdmin = checkAdminStatus(newDiscussion.discussionId);
    
            // Update the state immediately with the new discussion and its isAdmin property
            setUserDiscussions((prevDiscussions) => [
                ...prevDiscussions,
                { ...newDiscussion, isAdmin },
            ]);
        } catch (error) {
            console.error("Error checking admin status:", error);
        }
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
             <div className="user-info">
                <span className="username">{userId}</span>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
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
                            <button
                                className={`button ${!discussion.isAdmin ? 'disabled-button' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenAddUserPopup(discussion.discussionId, discussion.title);
                                }}
                                disabled={!discussion.isAdmin}
                            >
                                Add User
                            </button>
                            <button
                                className={`button ${!discussion.isAdmin ? 'disabled-button' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenAddChannelPopup(discussion.discussionId, discussion.title);
                                }}
                                disabled={!discussion.isAdmin}
                            >
                                Add Channel
                            </button>
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
            <Modal
                isOpen={isAddUserPopupOpen}
                onRequestClose={() => setIsAddUserPopupOpen(false)}
                style={customStyles}
            >
                <AddUser 
                    discussionId={selectedDiscussionId}
                    discussionTitle={selectedDiscussionTitle}
                />
            </Modal>
            <Modal
                isOpen={isAddChannelPopupOpen}
                onRequestClose={() => setIsAddChannelPopupOpen(false)}
                style={customStyles}
            >
                <AddChannel
                    discussionId={selectedDiscussionId}
                    discussionTitle={selectedDiscussionTitle}
                />
            </Modal>

            
        </div>
    );
}