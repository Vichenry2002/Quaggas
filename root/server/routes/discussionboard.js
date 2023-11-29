const express = require("express");
 
const discussionBoardRoutes = express.Router();
 
const dbo = require("../db/conn");
const {json} = require("express");
 
const ObjectId = require("mongodb").ObjectId;

//Get users by discussion board
userRoutes.route("/discussions/:discussionID/users").get(async function (req, response) {
    let db_connect = dbo.getDb();
    const discussionID = req.body.discussionID;

    try {
        const result = await db_connect.collection("discussions").findOne({ _id: new ObjectId(discussionId) });

        if (!result) {
            response.status(404).send("Discussion board not found");
            return;
        }
        response.json(result.users);
    } catch (err) {
        console.error("Error fetching user users:", err);
        response.status(500).send("Internal Server Error");
    }
});


//Get channels by discussion board
userRoutes.route("/discussions/:discussionID/channels").get(async function (req, response) {
    let db_connect = dbo.getDb();
    const discussionID = req.body.discussionID;

    try {
        const result = await db_connect.collection("discussions").findOne({ _id: new ObjectId(discussionId) });

        if (!result) {
            response.status(404).send("Discussion board not found");
            return;
        }
        response.json(result.channels);
    } catch (err) {
        console.error("Error fetching user channels:", err);
        response.status(500).send("Internal Server Error");
    }
});

// Endpoint to add a user to discussion board
userRoutes.route("discussions/:discussionId/:userID/addUser").put(function (req, res) {
    let db_connect = dbo.getDb();
    const userID = req.body.userID;
    const discussionId = req.body.discussionId; // Add title from the request body

    try {
        // Update the discussion document by pulling the userId from both the users and admins arrays
        db_connect.collection("discussions").updateOne(
            { _id: new ObjectId(discussionId) }, 
            { $push: { users: userId} }
        );

        // Send a success response back
        response.status(200).json({ message: "User added from discussion" });
    } catch (err) {
        // If an error occurs, send an error response
        console.error("Error while adding user to discussion:", err);
        response.status(500).json({ error: err.message });
    }
});

// Endpoint to remove a user to discussion board
userRoutes.route("discussions/:discussionId/:userID/removeUser").post(async function (req, res) {
    let db_connect = dbo.getDb();
    const userID = req.body.userID;
    const discussionId = req.body.discussionId; // Add title from the request body

    try {
        // Update the discussion document by pulling the userId from both the users and admins arrays
        await db_connect.collection("discussions").updateOne(
            { _id: new ObjectId(discussionId) }, 
            { $pull: { users: userId} }
        );

        // Send a success response back
        response.status(200).json({ message: "User removed from discussion" });
    } catch (err) {
        // If an error occurs, send an error response
        console.error("Error while removing user from discussion:", err);
        response.status(500).json({ error: err.message });
    }
});

// Endpoint to add a user to discussion board
userRoutes.route("discussions/:discussionId/:channelID/addChannel").put(function (req, res) {
    let db_connect = dbo.getDb();
    const channelID = req.body.channelID;
    const discussionId = req.body.discussionId; // Add title from the request body

    try {
        // Update the discussion document by pulling the userId from both the users and admins arrays
        db_connect.collection("discussions").updateOne(
            { _id: new ObjectId(discussionId) }, 
            { $push: { channels: channelID} }
        );

        // Send a success response back
        response.status(200).json({ message: "User added from discussion" });
    } catch (err) {
        // If an error occurs, send an error response
        console.error("Error while adding user to discussion:", err);
        response.status(500).json({ error: err.message });
    }
});

// Endpoint to remove a user to discussion board
userRoutes.route("discussions/:channelID/:newname/renameChannel").post(async function (req, res) {
    let db_connect = dbo.getDb();
    const channelID = req.body.channelID;
    const newname = req.body.newname; // Add title from the request body

    try {
        // Update the discussion document by pulling the userId from both the users and admins arrays
        await db_connect.collection("channels").updateOne(
            { _id: new ObjectId(channelID) }, 
            { $pull: { name: newname} }
        );

        // Send a success response back
        response.status(200).json({ message: "Channel renamed" });
    } catch (err) {
        // If an error occurs, send an error response
        console.error("Error while renaming channel", err);
        response.status(500).json({ error: err.message });
    }
});




module.exports = discussionBoardRoutes;
