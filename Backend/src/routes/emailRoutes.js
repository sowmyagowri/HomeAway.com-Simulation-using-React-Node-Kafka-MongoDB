//Libraries
var express = require('express');
var router = express.Router();
var kafka = require('../routes/kafka/client');

// Set up middleware
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});

router.route('/sendmail').post(requireAuth, function (req, res) {
    console.log("Inside Send Mail Post");

    var reply = {
        replied : true
    }

    var data = {
        sender : req.body.sender,
        senderEmailAddress : req.body.senderEmailAddress,
        receiver : req.body.receiver,
        timeReceived : Date.now(),
        mailContent : req.body.mailContent,
        propertyID : req.body.propertyID,
        propertyHeadline : req.body.propertyHeadline,
        city : req.body.city,
        noOfGuests : req.body.noOfGuests, 
        arrivalDate : req.body.arrivalDate,
        departDate : req.body.departDate,
        replied : req.body.replied,
    }
    console.log(data);

    kafka.make_request('email_topics',{"path":"sendmail", "reply": reply, "id": req.body._id, "data": data,}, function(error,result){
        
        if (error) {
            console.log(error);
            console.log("unable to insert into emails database");
            res.status(400).json({responseMessage: 'unable to insert into emails database'});
        } else {
            console.log("Email Added");
            res.status(200).json({responseMessage: 'Email Added'});
        }
    })
});

router.route('/getemails').post(requireAuth, function (req, res) {
    console.log("Inside get emails Request");
    console.log("req body:", req.body);
    kafka.make_request('email_topics',{"path":"getemails", "receiver": req.body.emailID}, function(error,result){
        
        if (error) {
            console.log(error);
            res.status(200).send("No Emails");      
        } else {
            console.log(result);
            res.status(200).send(result.result);
        }
    })
})

router.route('/getsentemails').post(requireAuth, function (req, res) {
    console.log("Inside get sent mails Request");
    console.log("req body:", req.body);
    kafka.make_request('email_topics',{"path":"getsentemails", "senderEmailAddress": req.body.emailID}, function(error,result){

        if (error) {
            console.log(error);
            res.status(200).send("No sent Emails");        
        } else {
            console.log(result);
            res.status(200).send(result.result);
        }
    })
})

module.exports = router;