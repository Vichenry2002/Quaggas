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
  } catch (err) {
      console.error("Error while inserting discussion:", err);
      response.status(500).send(err);
  }
});




//Delete discussion

//Update discussion (add users)


module.exports = discussionRoutes;
