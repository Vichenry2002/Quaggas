const express = require("express");
 
const recordRoutes = express.Router();
 
const dbo = require("../db/conn");
const {json} = require("express");
 
const ObjectId = require("mongodb").ObjectId;


//to get the entire colletion
//used it to see if registering worked
/*
recordRoutes.route("/record").get(function (req, res) {
 let db_connect = dbo.getDb("Quaggas");
 console.log(req);
 db_connect
   .collection("users")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
     console.log(result);
   });
});

 */

 
//can be used for Auth
/*
recordRoutes.route("/record/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("users")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});

 */


 //using it for registration

recordRoutes.route("/record/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myobj = {
   name: req.body.user_id,
   position: req.body.hashedpswd,
   discussions: req.body.discussions,
 };
 db_connect.collection("users").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});
 
/*


recordRoutes.route("/:id").delete((req, response) => {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("users").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});
*/
module.exports = recordRoutes;