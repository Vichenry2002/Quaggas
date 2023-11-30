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
import { ListItemAvatar, Avatar, TextField, Stack } from '@mui/material';

const drawerWidth = 300; //change this to percent scaling later

const DiscussionPage = () => {
    //default channel is general, always at index 0
    const [selectedIndex, setSelectedDiscussion] = React.useState(0);

    const [board, setBoard] = React.useState({title: 'default title', admins: [], users: [], channels: []});
    const [channel, setChannel] = React.useState([]);
    const [posts, setPosts] = React.useState([]);
    const [admins, setAdmins] = React.useState([]);
    const [users, setUsers] = React.useState([])

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
                <ListItem>
                    messages asdlkajflakjflakjfolk
                </ListItem>

                <Divider />

                <ListItem>
                    messages asdlkajflakjflakjfolk
                </ListItem>
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
