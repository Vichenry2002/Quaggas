const express = require("express");
const bcrypt = require('bcryptjs');
const CryptoJS= require('crypto-js')
const secretPass = "WfgHyiosyGH";
const recordRoutes = express.Router();
 
const dbo = require("../db/conn");
const {json} = require("express");
 
const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/record/auth").post(async function (req, response) {
    let db_connect = dbo.getDb();
    let myobj = {
        name: req.body.username,
    };
    var ress = await db_connect.collection("users").findOne(myobj)
    console.log(ress)
    if(ress==null){
        response.json("err")
    }
    else {
        //if password matches-> generate ticket->store ticket with expire time->send ticket over.
        const isMatch = await bcrypt.compare(req.body.hashedpswd, ress.position);
        if (isMatch) {
            var now = new Date();
            let expiryDate2 = new Date(Date.now() + 2 * (60 * 60 * 1000));
            console.log(expiryDate2);
            //var timestamp=Date.prototype.setTime(now.prototype.getTime()+(2*60*60*1000))
            let ticket = expiryDate2.toString();
            console.log(ticket);


            const encryptedData = CryptoJS.AES.encrypt(ticket, secretPass);
            console.log(encryptedData.toString());
            response.json(encryptedData.toString());

        }
        else{
            response.json("err")
        }
    }


});




 //using it for registration
recordRoutes.route("/record/add").post(async function (req, response) {
    let db_connect = dbo.getDb();
    let myobj = {
        name: req.body.user_id,
        position: req.body.hashedpswd,
        discussions: []
    };
    let user = {
        name: req.body.user_id,
    };
    var ress = await db_connect.collection("users").findOne(user)
    console.log(ress);
    if(ress != null){
        console.log("here")
        response.json("err");
    }
    else {
        console.log("there")
        db_connect.collection("users").insertOne(myobj, function (err, res) {
            if (err) throw err;
        });
        response.json("201")

    }
});
 
module.exports = recordRoutes;