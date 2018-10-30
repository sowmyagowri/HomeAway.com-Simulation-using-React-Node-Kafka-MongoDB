//Libraries
var express = require('express');
var router = express.Router();

var Emails = require('../models/EmailSchema');

// Set up middleware
var jwt = require('jsonwebtoken');
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});

router.route('/sendmail').post(requireAuth, function (req, res) {
  console.log("Inside Send Mail Post");

  var reply = {
      Replied : true
  }

  Emails.findOneAndUpdate({_id : req.body.Eid}, {$set : reply}, function(err, response) {
      console.log("Email Updated as Replied")
  })

  var data = {
    Sender : req.body.sendername,
    SenderEmailAddress : req.body.senderemail,
    Receiver : req.body.receiver,
    TimeReceived : Date.now(),
    MailContent : req.body.mailcontent,
    PropertyID : req.body.propertyid,
    PropertyHeader : req.body.propertyheader,
    City : req.body.propertylocated,
    Guests : req.body.guests, 
    Arrivaldate : req.body.checkin,
    Departdate : req.body.checkout,
    Replied : req.body.reply
   }

  Emails.create(data, function(error, result) {
      console.log(result)
      res.status(200).send("Success");
    })
});

router.route('/getemails').post(requireAuth, function (req, res) {
    console.log("Inside get emails Request");
    console.log("req body:", req.body);
    Emails.find({Receiver: req.body.emailID},function(err, result) {
      console.log(result)
      if (result) {
          res.status(200).send(result);
      } else { 
          res.status(200).send("No Emails");
      }
    })
})

router.route('/getsentemails').post(requireAuth, function (req, res) {
    console.log("Inside get sent mails Request");
  
    Emails.find({Sender: req.body.emailID},function(err, result) {
      console.log(result)
      if (result) {
          res.status(200).send(result);
      } else { 
          res.status(200).send("No Emails");
      }
    })
})

module.exports = router;