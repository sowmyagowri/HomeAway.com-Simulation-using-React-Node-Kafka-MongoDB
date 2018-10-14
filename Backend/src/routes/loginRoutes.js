//Libraries
var express = require('express');
var router = express.Router();
var crypt = require('../models/bcrypt.js');
var Users = require('../models/UserDBSchema');

// Validate traveller login user details
router.route('/traveller/login').post(function (req, res) {
  console.log("Inside traveller Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  
  Users.findOne({email:trimemail}, function(err,user){
    if (err) {
      console.log(err);
      console.log("unable to read the database");
      res.status(400).json({responseMessage: 'unable to read the users database'});
    } else if (user) {
      crypt.compareHash(req.body.password, user.password, function (err, isMatch) {
        if (isMatch && !err) {
          res.cookie('cookie1',"travellercookie",{maxAge: 900000, httpOnly: false, path : '/'});
          res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
          res.cookie('cookie3',user.firstname,{maxAge: 900000, httpOnly: false, path : '/'});
          req.session.user = user.email;
          res.status(200).json({responseMessage: 'Login Successful'});
          console.log("Traveller found in DB");
        } else {
          res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
          console.log("Authentication failed. Passwords did not match.");
        }
      })
    } else {
      res.status(402).json({responseMessage: 'Authentication failed. User does not exist.'})
      console.log("Authentication failed. User does not exist.");
    }
  })
})

// Validate owner login user details
router.route('/owner/login').post(function (req, res) {
  console.log("Inside Owner Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  
  Users.findOne({email:trimemail}, function(err,user){
    if (err) {
      console.log("User does not exist");
      res.status(400).json({responseMessage: 'User does not exist'});
    } else if (user) {
        crypt.compareHash(req.body.password, user.password, function (err, isMatch) {
          if (isMatch && !err && user.isOwner == 'Y') {
            res.cookie('cookie1',"ownercookie",{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie3',user.firstname,{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = user.email;
            console.log("Owner found in DB");
            res.status(200).json({responseMessage: 'Login Successful'});
          } else {
            res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
            console.log("Authentication failed. Passwords did not match.");
          }
        })
      }
      else {
        res.status(402).json({responseMessage: 'Authentication failed. User does not exist.'})
        console.log("Authentication failed. User does not exist.");
      }
    })
  });

// Add traveller users
router.route('/traveller/signup').post(function (req, res) {
  console.log("In traveller Signup Post");
  console.log(req.body);
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var today = new Date();
  var year = today.getFullYear();
  
  Users.findOne({email:trimemail}, function(err,rows){
    if (err){
        console.log(err);
        console.log("unable to read the database");
        res.status(400).json({responseMessage: 'unable to read the users database'});
    } else {
      if (rows) {
        console.log("User already exists");
        res.status(400).json({responseMessage: 'User already exists'});
      } else {
        crypt.createHash(req.body.password, function (response) {
          encryptedPassword = response;
          var userData = {
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "email": trimemail,
            "password": encryptedPassword,
            "created": year
          }
        
          //Save the user in database
          Users.create( userData, function (err) {
            if (err) {
            console.log("unable to insert into database", err);
            res.status(400).send("unable to insert into database");
          } else {
            console.log("User Added");
            res.cookie('cookie1',"travellercookie",{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie3',req.body.firstname,{maxAge: 900000, httpOnly: false, path : '/'});
            res.status(200).json({responseMessage: 'User Added'});
          }});
        })
      }
    }
  });
});

// Add owner users
router.route('/owner/signup').post(function (req, res) {
  console.log("In owner Signup Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var today = new Date();
  var year = today.getFullYear();
  
  Users.findOne({email:trimemail}, function(err,rows){
    if (err){
        console.log(err);
        console.log("unable to read the database");
        res.status(400).json({responseMessage: 'unable to read the users database'});
    } else {
      if (rows) {
        if (rows.isOwner == 'Y') {
          console.log("Owner already exists");
          res.status(400).json({responseMessage: 'Owner already exists'});
        } else{

          //Update traveller as owner in database
          Users.findOneAndUpdate({email:trimemail}, {isOwner:'Y'}, function(err,rows){
            if (err) {
              console.log(err);
              console.log("unable to update user to owner");
              res.status(400).json({responseMessage: 'unable to update user to owner'});
            } else{
              console.log("Owner profile added to traveller login");
              res.cookie('cookie1',"ownercookie",{maxAge: 900000, httpOnly: false, path : '/'});
              res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
              res.cookie('cookie3',rows.firstname,{maxAge: 900000, httpOnly: false, path : '/'});
              res.status(201).json({responseMessage: 'Owner profile added to traveller login'});
            }
          })
        }
      } else {

        crypt.createHash(req.body.password, function (response) {
          encryptedPassword = response;
      
          var userData = {
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "email": trimemail,
            "password": encryptedPassword,
            "created": year,
            "isOwner": 'Y'
          }
      
          //Save the user as owner in database
          Users.create( userData, function (err) {
          if (err) {
            console.log("unable to insert into database");
            res.status(400).json({responseMessage: 'unable to insert into users database'});
          } else {
            console.log("Owner Added");
            res.cookie('cookie1',"ownercookie",{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie2',trimemail,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookie3',req.body.firstname,{maxAge: 900000, httpOnly: false, path : '/'});
            res.status(200).json({responseMessage: 'Owner Added'});
          }});
        })
      }
    }
  })
});

// fetch user profile details
router.route('/profile').post(function (req, res) {
  console.log("Inside Profile fetch");
  var input_email = req.body.email;

  Users.findOne({email:input_email}, function(err,result){
    if (err){
      console.log(err);
      res.status(400).json({responseMessage: 'User not found'});
    }else {
      console.log("Profile Details:" , result);
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result));
    }
  })
});

// save user profile details
router.route('/profilesave').post(function (req, res) {
  console.log("In profile save Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  
  var userData = {
    "firstname": req.body.firstname,
    "lastname": req.body.lastname,
    "aboutMe" : req.body.aboutMe,
    "city" : req.body.city,
    "state" : req.body.state,
    "country" : req.body.country,
    "company" : req.body.company,
    "school" : req.body.school,
    "hometown" : req.body.hometown,
    "gender" : req.body.gender,
    "languages": req.body.languages,
    "phone" : req.body.phone
  }

  console.log(userData);
  Users.findOneAndUpdate({email:trimemail}, userData, {returnNewDocument: true} , function(err,result){
    if (err) {
      console.log(err);
      console.log("unable to update database");
      res.status(400).json({responseMessage: 'unable to update database'});
    } else {
      console.log(result);
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result));
    }
  })
});

module.exports = router;