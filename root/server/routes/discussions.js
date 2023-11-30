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




//Delete discussion

module.exports = discussionRoutes;
