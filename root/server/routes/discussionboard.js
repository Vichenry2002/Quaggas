const express = require("express");
 
const discussionBoardRoutes = express.Router();
 
const dbo = require("../db/conn");
const {json} = require("express");
 
const ObjectId = require("mongodb").ObjectId;

// Get discussion board page from discussionID (includes title, channels and users)
discussionBoardRoutes.route("/discussions/:discussionID").get(async function (req, response) {
    let db_connect = dbo.getDb();
    const discussionID = req.params.discussionID;

    try {
        const result = await db_connect.collection("discussions").findOne({ _id: new ObjectId(discussionID) });

        if (!result) {
            response.status(404).send("Discussion board not found");
            return;
        }
        response.json(result);
    } catch (err) {
        console.error("Error fetching Discussion Board:", err);
        response.status(500).send("Internal Server Error");
    }
});

// Add user to discussion board given userID and discussion board ID
discussionBoardRoutes.route("/discussions/:discussionId/:userID/:title/addUser").post(function (req, response) {
    let db_connect = dbo.getDb();
    const userID = req.params.userID; // Require userID
    const discussionId = req.params.discussionId; 
    const title = req.params.title; 


    try {
        // Update the discussion collection by adding userID to users list
        db_connect.collection("discussions").updateOne(
            { _id: new ObjectId(discussionId) }, 
            { $push: { users: userID} }
        );

        db_connect.collection("users").updateOne(
            { _id: new ObjectId(userID) }, 
            { $push: { discussions: { discussionId, title } } }
        );

        // Send a success response back
        response.status(200).json({ message: "User added from discussion" });
    } catch (err) {
        // If an error occurs, send an error response
        console.error("Error while adding user to discussion:", err);
        response.status(500).json({ error: err.message });
    }
});

// Remove user from discussion board given userID and board ID
discussionBoardRoutes.route("/discussions/:discussionId/:userID/removeUser").post(async function (req, response) {
    let db_connect = dbo.getDb();
    const userID = req.params.userID;
    const discussionId = req.params.discussionId; 

    try {
        // Update the discussion collection by pulling the userId from the users arrays
        await db_connect.collection("discussions").updateOne(
            { _id: new ObjectId(discussionId) }, 
            { $pull: { users: userID} }
        );

        await db_connect.collection("users").updateOne(
            { _id: new ObjectId(userID) }, 
            { $pull: { discussions: { discussionId: discussionId } } }
        );

        // Send a success response back
        response.status(200).json({ message: "User removed from discussion" });
    } catch (err) {
        // If an error occurs, send an error response
        console.error("Error while removing user from discussion:", err);
        response.status(500).json({ error: err.message });
    }
});

// Add Channel to discussion board
discussionBoardRoutes.route("/discussions/:discussionId/:channelName/addChannel").post(async function (req, res) {
    let db_connect = dbo.getDb();
    let myobj = {
        name: req.params.channelName,
        posts: []
    };
    let obj;
    try {
        let result = await db_connect.collection("channels").insertOne(myobj);
        res.status(201).json({ insertedId: result.insertedId });
        obj = result.insertedId.toString();
    } catch (err) {
        console.error("Error while inserting channels:", err);
        res.status(500).send(err);
    }
  
    const channelID = obj
    const discussionId = req.params.discussionId; 

    try {
        // Update the discussion collection by pushing/adding the channelID to the channels list
        db_connect.collection("discussions").updateOne(
            { _id: new ObjectId(discussionId) }, 
            { $push: { channels: channelID } }
        );
    
        // Send a success response back
    } catch (err) {
        // If an error occurs, send an error response
        console.error("Error while adding channel to discussion:", err);
    }    
});

// Remove Channel from discussion board
discussionBoardRoutes.route("/discussions/:discussionId/:channelID/removeChannel").put(function (req, response) {
    let db_connect = dbo.getDb();
    const channelID = req.params.channelID; // Require channel ID
    const discussionId = req.params.discussionId; 
    console.log(channelID);
    try {
        // Update the discussion collection by pulling the channelID to the channels list
        db_connect.collection("discussions").updateOne(
            { _id: new ObjectId(discussionId) }, 
            { $pull: { channels: new ObjectId(channelID)} }
        );

        // Send a success response back
        response.status(200).json({ message: "Channel added to discussion" });
    } catch (err) {
        // If an error occurs, send an error response
        console.error("Error while adding channel to discussion:", err);
        response.status(500).json({ error: err.message });
    }
});

// Rename channel 
discussionBoardRoutes.route("/discussions/:channelID/:newname/renameChannel").post(async function (req, response) {
    let db_connect = dbo.getDb();
    const channelID = req.params.channelID;
    const newname = req.params.newname; // Require new name

    try {
        // Set new name for channel
        await db_connect.collection("channels").updateOne(
            { _id: new ObjectId(channelID) }, 
            { $set: { name: newname} }
        );

        // Send a success response back
        response.status(200).json({ message: "Channel renamed" });
    } catch (err) {
        // If an error occurs, send an error response
        console.error("Error while renaming channel", err);
        response.status(500).json({ error: err.message });
    }
});

// Get Channel information with Posts
discussionBoardRoutes.route("/channels/:channelID").get(async function (req, response) {
    let db_connect = dbo.getDb();
    const channelID = req.params.channelID;

    try {
        // Fetch channel information
        const channel = await db_connect.collection("channels").findOne({ _id: new ObjectId(channelID) });

        if (!channel) {
            response.status(404).send("Channel not found");
            return;
        }

        // Fetch posts using the post IDs from the channel
        const postIDs = channel.posts || []; 
        const posts = await db_connect.collection("posts").find({ _id: { $in: postIDs.map(postID => new ObjectId(postID)) } }).toArray();

        // Combine channel and post information
        const result = {
            channel: channel,
            posts: posts
        };

        response.json(result);
    } catch (err) {
        console.error("Error fetching Channel and Posts:", err);
        response.status(500).send("Internal Server Error");
    }
});


//To be deleted later, get user from userID
discussionBoardRoutes.route("/users/:userID").get(async function (req, response) {
    let db_connect = dbo.getDb();
    const userID = req.params.userID;

    try {
        const result = await db_connect.collection("users").findOne({ _id: new ObjectId(userID) });

        if (!result) {
            response.status(404).send("Users not found");
            return;
        }
        response.json(result.name);
    } catch (err) {
        console.error("Error fetching users:", err);
        response.status(500).send("Internal Server Error");
    }
});

//To be deleted later, get user from userID
discussionBoardRoutes.route("/usersadd/:userID").get(async function (req, response) {
    let db_connect = dbo.getDb();
    const userID = req.params.userID;
    try {
        const result = await db_connect.collection("users").findOne({ name: userID });

        if (!result) {
            response.status(404).send("Users not found");
            return;
        }
        response.json(result._id);
    } catch (err) {
        console.error("Error fetching users:", err);
        response.status(500).send("Internal Server Error");
    }
});

// Add Post to discussion board
discussionBoardRoutes.route("/channels/:channelID/:userID/:content/addPost").post(async function (req, res) {
    let db_connect = dbo.getDb();
    const channelID = req.params.channelID;
    const d = new Date();
    let text = d.toISOString();

    let myobj = {
        user_id: req.params.userID,
        content: req.params.content,
        pinned: "",
        date: text
    };
    let obj;
    try {
        let result = await db_connect.collection("posts").insertOne(myobj);
        res.status(201).json({ insertedId: result.insertedId });
        obj = result.insertedId;
    } catch (err) {
        console.error("Error while inserting posts:", err);
        res.status(500).send(err);
    }


    try {
        // Update the discussion collection by pushing/adding the channelID to the channels list
        db_connect.collection("channels").updateOne(
            { _id: new ObjectId(channelID) }, 
            { $push: { posts: obj } }
        );

        // Send a success response back
    } catch (err) {
        // If an error occurs, send an error response
        console.error("Error while adding posts to channels:", err);
    }
});



module.exports = discussionBoardRoutes;
