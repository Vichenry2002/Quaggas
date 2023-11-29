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

    const [board, setBoard] = React.useState({title: 'default title'});

    //test constant discussion, to be changed later
    const discussionId = "6562539e872555cf4b716d2e";

    useEffect(() => {
        fetchDiscussionBoard();
        console.log(board);
    }, []);

    const fetchDiscussionBoard = async () => {
        try {
            const response = await fetch(`http://localhost:8081/discussions/${discussionId}`);
            const boardData = await response.json();

            console.log(boardData);
            
            if (board) {
                setBoard(boardData);
            } else {
                console.error("Invalid or no data for discussion");
            }
        } catch (error) {
            console.error("Error fetching discussion:", error);
        }
    };

    //changes the selected discussion page 
    const discussionPageClick = (event , index) => {
        setSelectedDiscussion(index);
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
                    <ListItemButton 
                        disablepadding
                        selected={selectedIndex === 0}
                        onClick={(event) => discussionPageClick(event, 0)}
                    >
                        general
                    </ListItemButton>

                    <ListItemButton 
                        disablepadding
                        selected={selectedIndex === 1}
                        onClick={(event) => discussionPageClick(event, 1)}
                    >
                        channel 0
                    </ListItemButton>

                    <ListItemButton 
                        disablepadding
                        selected={selectedIndex === 2}
                        onClick={(event) => discussionPageClick(event, 2)}
                    >
                        channel 1
                    </ListItemButton>

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
                anchor="bottom"
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
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar>H</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary='member 1' secondary='admin'></ListItemText>
                    </ListItem>


                    <ListItemButton disablepadding>
                    <ListItemText primary='member 1' secondary='admin'></ListItemText>
                    </ListItemButton>
                </List>

                <Divider />

                <List>
                    <ListItemButton disablepadding>
                        <ListItemText primary='member 1' secondary='member'></ListItemText>
                    </ListItemButton>

                    <ListItemButton disablepadding>
                        <ListItemText primary='member 2' secondary='member'></ListItemText>
                    </ListItemButton>

                    <ListItemButton disablepadding>
                        <ListItemText primary='member 3' secondary='member'></ListItemText>
                    </ListItemButton>

                </List>
        </Drawer>
        </Box>
      );
};

export default DiscussionPage;
