import './Discussion.css';
import React, { useEffect } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { ListItemAvatar, Avatar, TextField, Stack, IconButton, Icon } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PushPinIcon from '@mui/icons-material/PushPinRounded';
import SearchIcon from '@mui/icons-material/Search';
import CustomDialog from './dialogComponents';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Modal from 'react-modal'; // Import Modal from 'react-modal'


const drawerWidth = 300; //change this to percent scaling later
const DiscussionPage = () => {
    //default channel is general, always at index 0
    const [selectedIndex, setSelectedDiscussion] = React.useState(0);
    const [board, setBoard] = React.useState({title: 'default title', admins: [], users: [], channels: []});
    const [channel, setChannel] = React.useState([]);
    const [posts, setPosts] = React.useState([]);
    const [admins, setAdmins] = React.useState([]);
    const [users, setUsers] = React.useState([])
    const [open, setOpen] = React.useState(false);

    const [newPopupOpen, setNewPopupOpen] = React.useState(false);

    const [popup3Open, setPopup3Open] = React.useState(false);
    const [currentPopup, setCurrentPopup] = React.useState(null);
    const [popup3Input1, setPopup3Input1] = React.useState('');
    const [popup3Input2, setPopup3Input2] = React.useState('');
    const [commandInput, setcommandInput] = React.useState('');

    const [searchPopup, setSearchPopup] = React.useState(false);
    const [searchResults, setSearchResults] = React.useState([]);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const postMenuOpen = Boolean(anchorEl);
    
    //test constant discussion, to be changed later
    const discussionId = "6562539e872555cf4b716d2e";
    const userID = "65625388872555cf4b716d2d";
    //const disccusionId = window.location.pathname;
    //const userID = sessionStorage.getItem("username");

    useEffect(() => {
        fetchPage();
    }, []);

    const fetchPage = async () => {
        const discussion_board = await fetchDiscussionBoard();
        const admins_list = await fetchAdmins(discussion_board.admins);
        const users_list = await fetchUsers(discussion_board.admins, discussion_board.users);
        const channel_list = await fetchChannel(discussion_board.channels)
        const channel_list_name = fetchChannelnames(channel_list)
        const posts_list = fetchPosts(channel_list)
        setChannel(channel_list_name)
        setPosts(posts_list)
        setAdmins(admins_list)
        setUsers(users_list)
        console.log(posts_list)
    }

    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    

    const handlePopup3Open = () => {
        setPopup3Open(true);
    };

    const handlePopup3Close = () => {
        setPopup3Open(false);
        // Clear input when closing
        setPopup3Input1('');
        setPopup3Input2('');

    };

    const handlePopupOpen = (popupNumber) => {
        setCurrentPopup(popupNumber);
      };
      
      const handlePopupClose = () => {
        setCurrentPopup(null);
        setcommandInput('');

        // Optionally, you can clear input or perform other actions
      };

      const handleNewPopupOpen = () => {
        setNewPopupOpen(true);
    };

    const handleNewPopupClose = () => {
        setNewPopupOpen(false);
        // Optionally, you can clear input or perform other actions
    };

    const handleSearchClose = () => {
        setSearchPopup(false);
        // Optionally, you can clear input or perform other actions
    };
    
    const handlePopup3Submit = async () => {
        try {
            // Check if popup1Input is already in channel_list_name
            if (!channel.includes(popup3Input1)) {
                alert(`Channel ${popup3Input1} doesn't exist in the list.`);
                // Optionally, you can display a message or take other actions
            } else {
                // Send a request to add a channel to the discussion board
                const index = channel.indexOf(popup3Input1);
                const channel_id = board.channels[index]
                const response = await fetch(`http://localhost:8081/discussions/${channel_id}/${popup3Input2}/renameChannel`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert(`Channel has been renamed.`);
    
                // Clear input after submission
                setPopup3Input1('');
                setPopup3Input2('');
                // Close the popup
                setPopup3Open(false);
            }
        } catch (error) {
            console.error("Error while adding channel:", error);
            // Handle the error as needed
        }
    };

    const fetchDiscussionBoard = async () => {
        try {
            const response = await fetch(`http://localhost:8081/discussions/${discussionId}`);
            const boardData = await response.json();
            if (boardData) {
                setBoard(boardData)
                return boardData
            } else {
                console.error("Invalid or no data for discussion");
            }
        } catch (error) {
            console.error("Error fetching discussion:", error);
        }
    };

    const fetchChannel = async (channel_id_list) => {
        try {
          const channelDataList = [];
      
          for (const channel_id of channel_id_list) {
            const response = await fetch(`http://localhost:8081/channels/${channel_id}`);
            const channelData = await response.json();
            channelDataList.push(channelData);
          }
      
          return channelDataList
      
        } catch (error) {
          console.error("Error fetching channels:", error);
        }
    };
    const fetchChannelnames = (channel_list) => {
        const channelDataList = [];
    
        for (const channel of channel_list) {
        channelDataList.push(channel.channel.name);
        }
    
        return channelDataList
      
    };
    const fetchPosts = (channel_list) => {
        const postDataList = [];
    
        for (const channel of channel_list) {
            postDataList.push(channel.posts);
        }

        return postDataList
    };

    const fetchAdmins = async (admins_id_list) => {
      try {
          var admins_list = []
          admins_id_list.forEach(async (element) => {
              const response = await fetch(`http://localhost:8081/users/${element}`);
              const name = await response.json();
              if (name) {
                  admins_list.push(name)
              } 
          });
          return admins_list
      } catch (error) {
          console.error("Error loading admins:", error);
      }
  };
    const fetchUsers = async (admins, users) => {
        try {
            const diff = users.filter(x => !admins.includes(x));
            var users = []
            diff.forEach(async (element) => {
                const response = await fetch(`http://localhost:8081/users/${element}`);
                const name = await response.json();
                if (name) {
                    users.push(name)
                } 
            });
            return users
        } catch (error) {
            console.error("Error fetching discussion:", error);
        }
    };
    //changes the selected discussion page 
    const discussionPageClick = (event , index) => {
        setSelectedDiscussion(index);
    };

    const handlePostClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePostClose = () => {
        setAnchorEl(null);
    };

    const handlePostPin = (event, index) => {
        const post = posts[selectedIndex][index];

        
    }

    const submitHandle = async (inputValue) => {
        try {
            switch (inputValue) {
                case 1:
                    // Check if channel is already in channe list
                    if (channel.includes(commandInput)) {
                        alert(`Channel ${commandInput} already exists in the list.`);
                    } else {
                        // Send a request to add a channel to the discussion board
                        const response = await fetch(`http://localhost:8081/discussions/${discussionId}/${commandInput}/addChannel`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        alert(`Channel has been created.`);
                    }
                    break;
                case 2:
                    // Check if command is not in channel
                    if (!channel.includes(commandInput)) {
                        alert(`Channel ${commandInput} doesn't exist in the list.`);
                    } else {
                        // Send a request to remove a channel from the discussion board
                        const index = channel.indexOf(commandInput);
                        const channel_id = board.channels[index]
                        const response = await fetch(`http://localhost:8081/discussions/${discussionId}/${channel_id}/removeChannel`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        alert(`Channel has been removed.`);
                    }
                    break;
                case 4:
                    // Check if commandInput is already in user list
                    if (users.includes(commandInput)) {
                        alert(`User ${commandInput} exist in the list.`);
                    } else {
                        const temp = await fetch(`http://localhost:8081/usersadd/${commandInput}`);
                        const isReal = await temp.json();
    
                        const response = await fetch(`http://localhost:8081/discussions/${discussionId}/${isReal}/${board.title}/addUser`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        alert(`User has been added.`);
    
                    }
                    break;
                case 5:
                    // Check if commandInput is not in user list
                    if (!users.includes(commandInput)) {
                        alert(`User ${commandInput} doesn't exist in the list.`);
                    } else {
                        // Send a request to remove a user from the discussion board
                        const temp = await fetch(`http://localhost:8081/usersadd/${commandInput}`);
                        const isReal = await temp.json();
    
                        const response = await fetch(`http://localhost:8081/discussions/${discussionId}/${isReal}/removeUser`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        alert(`User has been removed.`);
                    }
                    break;
                default:
                    console.error('Invalid Command');
                    return;
            }
    
        } catch (error) {
            console.error(`Error while ${inputValue}:`, error);
        }
    };

    function stringToColor(string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
        return {
            sx: {
              bgcolor: color,
            },
          };
      }

    const handleSendMessage = async () => {
        const message = document.getElementById('send-message');

        if (message.value) {
            await fetch(`http://localhost:8081/channels/${board.channels[selectedIndex]}/${userID}/${message.value}/addPost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log(message.value);
            fetchPage();
            
            message.value = '';
        }
    };

    const handleSearch = () => {
        const search = document.getElementById('search-message');
        var found = [];

        if (search.value) {
            const channel_posts = posts[selectedIndex];
            console.log(search.value);

            channel_posts.forEach((post) => {
                if (post.content.includes(search.value)) {
                    found.push(post);
                }
            });

            setSearchResults(found);
            setSearchPopup(true);

            //console.log(found);

            search.value = '';
        }
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
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography 
                        variant="h6" 
                        noWrap
                        component="div"  
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block'}}}
                    >
                        {board.title}
                    </Typography>

                    <div 
                        className="search-bar-features"
                    >   
                        <IconButton
                            sx={{
                                paddingTop: '1.3vh',
                                paddingRight: '1vw'
                            }}
                            onClick={handleNewPopupOpen}
                        >
                            <PushPinIcon />
                        </IconButton>

                        <TextField 
                            id="search-message" 
                            label="Search"
                            variant="outlined"
                            sx={{
                                position: 'relative',
                                backgroundColor: 'white',
                                marginLeft: 0,
                                borderRadius: '5px'
                            }}
                        /> 

                        <IconButton
                            onClick={handleSearch}
                            sx={{
                                paddingTop: '1.3vh',
                                paddingLeft: '1vw'
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>

            


                <Drawer
                    variant="permanent"
                    sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />
                    <Box height="100vh" sx={{ overflow: 'auto' }}>
                    <List>
                        {channel.map((channelName, index) => (
                            <ListItemButton 
                            key={index}
                            disablepadding
                            selected={selectedIndex === index}
                            onClick={(event) => discussionPageClick(event, index)}
                            >
                            {channelName}
                            </ListItemButton>
                        ))}
                    </List>
                    <Divider />
                        <Button variant="contained" onClick={handleOpen}>
                            Admin Settings
                        </Button>

                        <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Admin Controls</DialogTitle>
                        <DialogContent>
                        <Stack spacing={2}>
                            <Button variant="contained" onClick={() => handlePopupOpen(1)}>
                            Add Channel
                            </Button>
                            <Button variant="contained" onClick={() => handlePopupOpen(2)}>
                            Remove Channel
                            </Button>
                            <Button variant="contained" onClick={handlePopup3Open}>
                            Rename Channel
                            </Button>
                            <Button variant="contained" onClick={() => handlePopupOpen(4)}>
                            Add User
                            </Button>
                            <Button variant="contained" onClick={() => handlePopupOpen(5)}>
                            Remove User
                            </Button>
                        </Stack>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose} variant="contained">
                            Close
                        </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={popup3Open} onClose={handlePopup3Close}>
                        <DialogTitle>Popup 3 Title</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Enter Text 1"
                                variant="outlined"
                                value={popup3Input1}
                                onChange={(e) => setPopup3Input1(e.target.value)}
                            />
                            <TextField
                                label="Enter Text 2"
                                variant="outlined"
                                value={popup3Input2}
                                onChange={(e) => setPopup3Input2(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handlePopup3Submit} variant="contained" color="primary">
                                Submit
                            </Button>
                            <Button onClick={handlePopup3Close} variant="contained">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {currentPopup !== null && (
                    <CustomDialog
                        open={currentPopup !== null}  // Update this line
                        handleClose={handlePopupClose}
                        handleSubmit={() => submitHandle(currentPopup)}
                        title={`Popup ${currentPopup} Title`}
                        inputLabel="Enter Text"
                        inputValue={commandInput}
                        handleInputChange={setcommandInput}
                    />
                    )}

                    <Dialog open={newPopupOpen} onClose={handleNewPopupClose}>
                        <DialogTitle>Pinned messages</DialogTitle>
                        <DialogContent>
                            <Stack spacing={0}>
                                {posts[selectedIndex] &&
                                    posts[selectedIndex].filter((post) => post.pinned).map((post, index) => (
                                        <div key={index}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar {...stringToColor(post.user_id)}>{post.user_id.charAt(0)}</Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={post.user_id} secondary={post.content}></ListItemText>
                                            </ListItem>
                                            <Divider />
                                        </div>
                                    ))}
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleNewPopupClose} variant="contained">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={searchPopup} onClose={handleSearchClose}>
                        <DialogTitle>Search Results</DialogTitle>
                        <DialogContent>
                            <Stack spacing={0}>
                                {searchResults && searchResults.map((post, index) => (
                                    <div key={index}>
                                        <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar {...stringToColor(post.user_id)}>{post.user_id.charAt(0)}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={post.user_id} secondary={post.content}></ListItemText>
                                    </ListItem>
                                    <Divider />
                                    </div>
                                ))}
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleSearchClose} variant="contained">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>


                    </Box>
                </Drawer>
            <Box 
                component="main"
                fullwidth
                sx={{ flexGrow: 1, p: 3, border: '2px solid red', height: "100vh", overflow: "hidden"}}
            >
                <Toolbar />
                
                <Stack spacing={0}>
                    {posts[selectedIndex] && posts[selectedIndex].map((post, index) => (
                        <div>
                            <ListItem 
                                alignItems="flex-start"
                                key = {index}
                            >
                                <ListItemAvatar>
                                    <Avatar {...stringToColor(post.user_id)}>{post.user_id.charAt(0)}</Avatar>
                                </ListItemAvatar>

                                <ListItemText primary={post.user_id} secondary={post.content}></ListItemText>
                                <IconButton
                                    sx={{paddingLeft: "2%", paddingTop: "1%"}}
                                    onClick={handlePostClick}
                                >
                                    <MoreVertIcon></MoreVertIcon>
                                </IconButton>
                                <Menu
                                    id="post-menu"
                                    anchorEl={anchorEl}
                                    open={postMenuOpen}
                                    onClose={handlePostClose}
                                    MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={handlePostClose}>Pin Post</MenuItem>
                                    <MenuItem onClick={handlePostClose}>Delete Post</MenuItem>
                                </Menu>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </Stack>

                <Box
                    sx={{position: "absolute", bottom: 0, boxSizing: "border-box", width: "66%", paddingBottom: "2vh"}}
                >
                    <TextField 
                        id="send-message" 
                        label="Send a message" 
                        variant="outlined" 
                        sx={{width: "95%"}}
                    />    

                    <IconButton
                        sx={{paddingLeft: "2%", paddingTop: "1%"}}
                        onClick={handleSendMessage}
                    >
                        <SendIcon></SendIcon>
                    </IconButton>
                    
                </Box>
            </Box>
            <Drawer
                sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                }}
                variant="permanent"
                anchor="right"
            >
                <Toolbar />
                <Divider />
                <List>
                    {admins && admins.map((admin, index) => (
                        <ListItem 
                            alignItems="flex-start"
                            key = {index}
                        >
                        <ListItemAvatar>
                            <Avatar {...stringToColor(admin)}>{admin.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={admin} secondary='Admin'></ListItemText>
                        </ListItem>
                    ))}
                </List>
                    <Divider />
                    <List>
                        {users && users.map((user, index) => (
                            <ListItem 
                                alignItems="flex-start"
                                key = {index}
                            >
                            <ListItemAvatar>
                                <Avatar {...stringToColor(user)}>{user.charAt(0)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={user} secondary='User'></ListItemText>
                            </ListItem>
                        ))}
                    </List>
            </Drawer>
        </Box>
      );
};
export default DiscussionPage;
