const express = require("express");
 
const discussionRoutes = express.Router();
 
const dbo = require("../db/conn");
const {json} = require("express");
 
const ObjectId = require("mongodb").ObjectId;

//Get discussions by user_id

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
  


//Delete discussion

module.exports = discussionRoutes;
