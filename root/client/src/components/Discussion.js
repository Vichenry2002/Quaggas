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
import { ListItemAvatar, Avatar, TextField, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';


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
    const [popup1Open, setPopup1Open] = React.useState(false);
    const [popup2Open, setPopup2Open] = React.useState(false);
    const [popup3Open, setPopup3Open] = React.useState(false);
    const [popup4Open, setPopup4Open] = React.useState(false);
    const [popup5Open, setPopup5Open] = React.useState(false);
    const [popup1Input, setPopup1Input] = React.useState('');
    const [popup2Input, setPopup2Input] = React.useState('');
    const [popup3Input, setPopup3Input] = React.useState('');
    const [popup4Input, setPopup4Input] = React.useState('');
    const [popup5Input, setPopup5Input] = React.useState('');
    
    //test constant discussion, to be changed later
    const discussionId = "6562539e872555cf4b716d2e";
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
    
    const handlePopup1Open = () => {
        setPopup1Open(true);
    };

    const handlePopup1Close = () => {
        setPopup1Open(false);
        // Clear input when closing
        setPopup1Input('');
    };

    const handlePopup2Open = () => {
        setPopup2Open(true);
    };

    const handlePopup2Close = () => {
        setPopup2Open(false);
        // Clear input when closing
        setPopup2Input('');
    };

    const handlePopup3Open = () => {
        setPopup1Open(true);
    };

    const handlePopup3Close = () => {
        setPopup1Open(false);
        // Clear input when closing
        setPopup1Input('');
    };

    const handlePopup4Open = () => {
        setPopup2Open(true);
    };

    const handlePopup4Close = () => {
        setPopup2Open(false);
        // Clear input when closing
        setPopup2Input('');
    };

    const handlePopup5Open = () => {
        setPopup1Open(true);
    };

    const handlePopup5Close = () => {
        setPopup1Open(false);
        // Clear input when closing
        setPopup1Input('');
    };


    const handlePopup1Submit = async () => {
        try {
            // Check if popup1Input is already in channel_list_name
            if (channel.includes(popup1Input)) {
                alert(`Channel "${popup1Input}" already exists in the list.`);
                // Optionally, you can display a message or take other actions
            } else {
                // Send a request to add a channel to the discussion board
                const response = await fetch(`http://localhost:8081/discussions/${discussionId}/${popup1Input}/addChannel`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert(`Channel has been created.`);
    
                // Clear input after submission
                setPopup1Input('');
                // Close the popup
                setPopup1Open(false);
            }
        } catch (error) {
            console.error("Error while adding channel to discussion:", error);
            // Handle the error as needed
        }
    };
    
      
    const handlePopup2Submit = async () => {
        try {
            // Check if popup2Input is not in channel
            if (!channel.includes(popup2Input)) {
                alert(`Channel "${popup2Input}" doesn't exist in the list.`);
                // Optionally, you can display a message or take other actions
            } else {
                // Send a request to remove a channel to the discussion board
                const index = channel.indexOf(popup2Input);
                const channel_id = board.channels[index]
                console.log(channel_id)
                const response = await fetch(`http://localhost:8081/discussions/${discussionId}/${channel_id}/removeChannel`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert(`Channel has been removed.`);
    
                // Clear input after submission
                setPopup2Input('');
                // Close the popup
                setPopup2Open(false);
            }
        } catch (error) {
            console.error("Error while removing channel from discussion:", error);
            // Handle the error as needed
        }
    };
    

    const handlePopup3Submit = () => {
        // Handle form submission for Popup 1
        console.log(`Submitting Popup 1 with input: ${popup1Input}`);
        // Add your logic here to handle the form data
        // You can send the data to the server or update state as needed
        // Clear input after submission
        setPopup1Input('');
        // Close the popup
        setPopup1Open(false);
    };

    const handlePopup4Submit = () => {
        // Handle form submission for Popup 2
        console.log(`Submitting Popup 2 with input: ${popup2Input}`);
        // Add your logic here to handle the form data
        // You can send the data to the server or update state as needed
        // Clear input after submission
        setPopup2Input('');
        // Close the popup
        setPopup2Open(false);
    };

    const handlePopup5Submit = () => {
        // Handle form submission for Popup 1
        console.log(`Submitting Popup 1 with input: ${popup1Input}`);
        // Add your logic here to handle the form data
        // You can send the data to the server or update state as needed
        // Clear input after submission
        setPopup1Input('');
        // Close the popup
        setPopup1Open(false);
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
    }
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
    return (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                {board.title}
              </Typography>
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
                        <Button variant="contained" onClick={handlePopup1Open}>
                        Add Channel
                        </Button>
                        <Button variant="contained" onClick={handlePopup2Open}>
                        Remove Channel
                        </Button>
                        <Button variant="contained" onClick={handlePopup3Open}>
                        Rename Channel
                        </Button>
                        <Button variant="contained" onClick={handlePopup4Open}>
                        Add User
                        </Button>
                        <Button variant="contained" onClick={handlePopup5Open}>
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

                <Dialog open={popup1Open} onClose={handlePopup1Close}>
                    <DialogTitle>Popup 1 Title</DialogTitle>
                    <DialogContent>
                    <TextField
                        label="Enter Text"
                        variant="outlined"
                        value={popup1Input}
                        onChange={(e) => setPopup1Input(e.target.value)}
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handlePopup1Submit} variant="contained" color="primary">
                        Submit
                    </Button>
                    <Button onClick={handlePopup1Close} variant="contained">
                        Close
                    </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={popup2Open} onClose={handlePopup2Close}>
                    <DialogTitle>Popup 2 Title</DialogTitle>
                    <DialogContent>
                    <TextField
                        label="Enter Text"
                        variant="outlined"
                        value={popup2Input}
                        onChange={(e) => setPopup2Input(e.target.value)}
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handlePopup2Submit} variant="contained" color="primary">
                        Submit
                    </Button>
                    <Button onClick={handlePopup2Close} variant="contained">
                        Close
                    </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={popup3Open} onClose={handlePopup3Close}>
                    <DialogTitle>Popup 3 Title</DialogTitle>
                    <DialogContent>
                    <TextField
                        label="Enter Text"
                        variant="outlined"
                        value={popup3Input}
                        onChange={(e) => setPopup3Input(e.target.value)}
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

                <Dialog open={popup4Open} onClose={handlePopup4Close}>
                    <DialogTitle>Popup 4 Title</DialogTitle>
                    <DialogContent>
                    <TextField
                        label="Enter Text"
                        variant="outlined"
                        value={popup4Input}
                        onChange={(e) => setPopup4Input(e.target.value)}
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handlePopup4Submit} variant="contained" color="primary">
                        Submit
                    </Button>
                    <Button onClick={handlePopup4Close} variant="contained">
                        Close
                    </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={popup5Open} onClose={handlePopup5Close}>
                    <DialogTitle>Popup 5 Title</DialogTitle>
                    <DialogContent>
                    <TextField
                        label="Enter Text"
                        variant="outlined"
                        value={popup5Input}
                        onChange={(e) => setPopup5Input(e.target.value)}
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handlePopup5Submit} variant="contained" color="primary">
                        Submit
                    </Button>
                    <Button onClick={handlePopup5Close} variant="contained">
                        Close
                    </Button>
                    </DialogActions>
                </Dialog>

                </Box>
            </Drawer>
        <Box 
            component="main"
            fullwidth
            anchorOrigin={{vertical: 'bottom'}}
            sx={{ flexGrow: 1, p: 3, border: '2px solid red'}}
        >
            <Toolbar />
            <Stack spacing={0}>
                {posts[selectedIndex] && posts[selectedIndex].map((post, index) => (
                    <div>
                        <ListItem
                            key = {index}
                        >
                        {post.content}
                        </ListItem>

                        <Divider />
                    </div>
                ))}
            </Stack>

            <TextField 
    
    
  
                fullWidth
                id="send-message" 
                label="Send a message" 
                variant="outlined" 
            />
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
