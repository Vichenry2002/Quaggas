const express = require("express");
 
const userRoutes = express.Router();
 
const dbo = require("../db/conn");
const {json} = require("express");
 
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
userRoutes.route("/user/:username/addDiscussion").put(function (req, res) {
    let db_connect = dbo.getDb();
    const discussionId = req.body.discussionId;
    const title = req.body.discussionTitle; // Add title from the request body

    db_connect.collection("users").updateOne(
        { name: req.params.username }, // Use the username directly
        { $push: { discussions: { discussionId, title } } }, // Add the tuple to the discussions array
        function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send("Discussion added successfully");
            }
        }
    );
});


//Delete discussion

//Update discussion (add users)


module.exports = userRoutes;
