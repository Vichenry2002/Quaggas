const express = require("express");
const bcrypt = require('bcryptjs');
const CryptoJS= require('crypto-js')
const secretPass = "WfgHyiosyGH";
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

recordRoutes.route("/record/auth").post(async function (req, response) {
    let db_connect = dbo.getDb();
    let myobj = {
        name: req.body.username,
    };
    var ress = await db_connect.collection("users").findOne(
    myobj)
    //if password matches-> generate ticket->store ticket with expire time->send ticket over.
    const isMatch = await bcrypt.compare(req.body.hashedpswd,ress.position);
    if(isMatch){
        var now=new Date();
        let expiryDate2 = new Date(Date.now() + 2 * (60 * 60 * 1000) );
        console.log(expiryDate2);
        //var timestamp=Date.prototype.setTime(now.prototype.getTime()+(2*60*60*1000))
        let ticket =   expiryDate2.toString();
        console.log(ticket);


        const encryptedData = CryptoJS.AES.encrypt(ticket,secretPass);
        console.log(encryptedData.toString());
        response.status(201).json(encryptedData.toString());

    }

});




 //using it for registration

recordRoutes.route("/record/add").post(function (req, response) {
 let db_connect = dbo.getDb();
 let myobj = {
   name: req.body.user_id,
   position: req.body.hashedpswd,
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