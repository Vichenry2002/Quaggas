const express = require("express");
 
const discussionRoutes = express.Router();
 
const dbo = require("../db/conn");
const {json} = require("express");
 
const ObjectId = require("mongodb").ObjectId;


//Create discussion
discussionRoutes.route("/discussions/add").post(async function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
      title: req.body.title,
      users: req.body.users,
      admins: req.body.admins,
      channels: req.body.channels,
  };

  try {
      let result = await db_connect.collection("discussions").insertOne(myobj);
      response.status(201).json({ insertedId: result.insertedId });
      console.log(result.insertedId.toString());
  } catch (err) {
      console.error("Error while inserting discussion:", err);
      response.status(500).send(err);
  }
});

// Add user to the user list of discussion
discussionRoutes.route("/discussion/:discussionId/addUser/:userId").post(async function (req, response) {
  let db_connect = dbo.getDb();
  const discussionId = req.params.discussionId;
  const userId = req.params.userId;

  try {
      // Update the discussion document by pushing the userId to the users array
      await db_connect.collection("discussions").updateOne(
          { _id: new ObjectId(discussionId) }, 
          { $addToSet: { users: userId } } // Use $addToSet to prevent duplicate entries
      );

      // Send a success response back
      response.status(200).json({ message: "User added to discussion" });
  } catch (err) {
      // If an error occurs, send an error response
      console.error("Error while updating discussion:", err);
      response.status(500).json({ error: err.message });
  }
});

// Add user to the admin list of discussion
discussionRoutes.route("/discussion/:discussionId/addAdmin/:userId").post(async function (req, response) {
  let db_connect = dbo.getDb();
  const discussionId = req.params.discussionId;
  const userId = req.params.userId;
  console.log("HeLLO");

  try {
      // Update the discussion document by pushing the userId to the users array
      await db_connect.collection("discussions").updateOne(
          { _id: new ObjectId(discussionId) }, 
          { $addToSet: { admins: userId } } // Use $addToSet to prevent duplicate entries
      );

      // Send a success response back
      response.status(200).json({ message: "User added to discussion" });
  } catch (err) {
      // If an error occurs, send an error response
      console.error("Error while updating discussion:", err);
      response.status(500).json({ error: err.message });
  }
});



//remove user from admin+user list of discussion
discussionRoutes.route("/discussion/:discussionId/:userId/remove").post(async function (req, response) {
    let db_connect = dbo.getDb();
    const discussionId = req.params.discussionId;
    const userId = req.params.userId
    console.log(discussionId);

    try {
        // Update the discussion document by pulling the userId from both the users and admins arrays
        await db_connect.collection("discussions").updateOne(
            { _id: new ObjectId(discussionId) }, 
            { $pull: { users: userId, admins: userId } }
        );

        // Send a success response back
        response.status(200).json({ message: "User removed from discussion" });
    } catch (err) {
        // If an error occurs, send an error response
        console.error("Error while updating discussion:", err);
        response.status(500).json({ error: err.message });
    }
});

//create channel
discussionRoutes.route("/channel/add").post(async function (req, response) {
    let db_connect = dbo.getDb();
    const channelName = req.body.name; 
    const posts = req.body.posts; 
  
    const newChannel = {
      name: channelName,
      posts: posts,
    };
  
    try {
      // Insert the new channel into the database
      const result = await db_connect.collection("channels").insertOne(newChannel);
  
      // Send the new channel ID back in the response
      response.status(201).json({
        status: 'success',
        message: 'Channel created successfully',
        channelId: result.insertedId, 
      });
    } catch (error) {
      response.status(500).json({
        status: 'failure',
        message: 'Error creating channel',
        error: error.message,
      });
    }
  });

//is admin
discussionRoutes.route("/discussion/:discussionId/isAdmin/:username").get(async function (req, response) {
  let db_connect = dbo.getDb();
  const discussionId = req.params.discussionId;
  const username = req.params.username;
  console.log(discussionId);

  try {
      // Retrieve the discussion document
      const discussion = await db_connect.collection("discussions").findOne({ _id: new ObjectId(discussionId) });

      if (!discussion) {
          response.status(404).json({ error: "Discussion not found" });
          return;
      }

      // Check if the provided username is in the admins list
      const isAdmin = discussion.admins.includes(username);
      response.status(200).json({ isAdmin });
  } catch (err) {
      // If an error occurs, send an error response
      console.error("Error while checking admin status:", err);
      response.status(500).json({ error: err.message });
  }
});


module.exports = discussionRoutes;
