const express = require("express");
 
const userRoutes = express.Router();
 
const dbo = require("../db/conn");
const {json} = require("express");
const { ReturnDocument } = require("mongodb");
 
const ObjectId = require("mongodb").ObjectId;

//Get discussions by user_id
userRoutes.route("/user/:username/discussions").get(async function (req, response) {
    let db_connect = dbo.getDb();

    try {
        const result = await db_connect.collection("users").findOne({ name: req.params.username });

        if (!result) {
            response.status(404).send("User not found");
            return;
        }
        response.json(result.discussions);
    } catch (err) {
        console.error("Error fetching user discussions:", err);
        response.status(500).send("Internal Server Error");
    }
});

// In your userRoutes file

// Endpoint to add a discussion to a user's discussions
// Endpoint to add a discussion to a user's discussions
userRoutes.route("/user/:username/addDiscussion").put(async function (req, res) {
    let db_connect = dbo.getDb();
    const discussionId = req.body.discussionId;
    const title = req.body.discussionTitle; // Add title from the request body

    try {
        const result = await db_connect.collection("users").updateOne(
            { name: req.params.username }, // Use the username directly
            { $push: { discussions: { discussionId, title } } } // Add the tuple to the discussions array
        );

        if (result.modifiedCount === 1) {
            // User's discussions were updated successfully
            res.status(200).send("Discussion added successfully");
        } else {
            // No user was found with the provided username
            res.status(404).send("User not found");
        }
    } catch (err) {
        // Handle any errors that occurred during the database update
        console.error("Error adding discussion to user:", err);
        res.status(500).send("Internal Server Error");
    }
});



//remove discussion from user db
userRoutes.route("/user/:userId/:discussionId/remove").post(async function (req, response) {
    let db_connect = dbo.getDb();
    const discussionId = req.params.discussionId;
    const userId = req.params.userId;

    try {
        await db_connect.collection("users").updateOne(
            { name: userId }, 
            { $pull: { discussions: { discussionId: discussionId } } }
        );

        response.status(200).json({ message: "User removed from discussion" });
    } catch (err) {
        console.error("Error while updating discussion:", err);
        response.status(500).json({ error: err.message });
    }
});





module.exports = userRoutes;
