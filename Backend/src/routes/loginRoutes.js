//Libraries
var express = require('express');
var router = express.Router();
var kafka = require('../routes/kafka/client');
var config = require('../../config/settings');

// Set up middleware
var jwt = require('jsonwebtoken');
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});

// Validate traveller login user details and get a JSON Web Token to include in the header of future requests.
router.route('/traveller/login').post(function (req, res) {
  console.log("Inside traveller Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  
  kafka.make_request('login_topics',{"path":"travellerlogin", "trimemail": trimemail, "password":req.body.password}, function(err,result){
    if(err){
      res.status(400).json({responseMessage: 'unable to read the users database'});
    }
    else if (result.status === 200)
    {
      console.log("result:", result);
      // Create token if the password matched and no error was thrown
      var token = jwt.sign({ id: result.user._id, email: result.user.email }, config.secret_key, {
        expiresIn: 7200 // expires in 2 hours
      });
      req.session.user = result.user.email;
      //It’s important the Auth header starts with JWT and a whitespace followed by the token, else passport-jwt will not extract it.
      res.status(200).json({responseMessage: 'Login Successful', token: 'JWT ' + token, cookie1: 'travellercookie', cookie2: trimemail, cookie3: result.user.firstname, cookie4: result.user.lastname});
      console.log("Traveller found in DB");
    } else if (result.status === 401){
      res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
      console.log("Authentication failed. Passwords did not match.");
    } else if (result.status === 402){
      res.status(402).json({responseMessage: 'Authentication failed. User does not exist.'})
      console.log("Authentication failed. User does not exist.");
    }
  });
})

// Validate owner login user details and get a JSON Web Token to include in the header of future requests.
router.route('/owner/login').post(function (req, res) {
  console.log("Inside Owner Login Post");
  var email = req.body.email;
  var lowercaseemail = email.toLowerCase();
  var trimemail = lowercaseemail.trim();
  
  kafka.make_request('login_topics',{"path":"ownerlogin", "trimemail": trimemail, "password": req.body.password}, function(err,result){
    if (err) {
        res.status(400).json({responseMessage: 'Database Error'});
    }
    else if (result.status === 200)
    {
      console.log("result:", result);
      // Create token if the password matched and no error was thrown
      var token = jwt.sign({ id: result.user._id, email: result.user.email }, config.secret_key, {
        expiresIn: 7200 // expires in 2 hours
      });
      req.session.user = result.user.email;
      //It’s important the Auth header starts with JWT and a whitespace followed by the token, else passport-jwt will not extract it.
      res.status(200).json({responseMessage: 'Login Successful', token: 'JWT ' + token, cookie1: 'ownercookie', cookie2: trimemail, cookie3: result.user.firstname, cookie4: result.user.lastname});
      console.log("Owner found in DB and token is", token);
    } else if (result.status === 401){
      res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
      console.log("Authentication failed. Passwords did not match.");
    } else if (result.status === 402){
      res.status(402).json({responseMessage: 'Authentication failed. User does not exist.'})
      console.log("Authentication failed. User does not exist.");
    }
  })
});

// Add traveller users and get a JSON Web Token to include in the header of future requests.
router.route('/traveller/signup').post(function (req, res) {
  console.log("In traveller Signup Post");
  console.log(req.body);
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  
  kafka.make_request('login_topics',{"path":"travellersignup", "trimemail": trimemail, "body": req.body}, function(err,result){
    if (err) {
      res.status(400).json({responseMessage: 'Database Error'});
    }
    else if (result.status === 200)
    {
      console.log("User Added");
      // Create token if the password matched and no error was thrown
      var token = jwt.sign({ id: result.user._id, email: result.user.email }, config.secret_key, {
        expiresIn: 7200 // expires in 2 hours
      });
      res.status(200).json({responseMessage: 'User Added', token: 'JWT ' + token, cookie1: 'travellercookie', cookie2: trimemail, cookie3: req.body.firstname, cookie4: req.body.lastname});
    } else if (result.status === 401){
      console.log("User already exists");
      res.status(401).json({responseMessage: 'User already exists'})
    }
  });
});

// Add owner users and get a JSON Web Token to include in the header of future requests.
router.route('/owner/signup').post(function (req, res) {
  console.log("In owner Signup Post");
  email = req.body.email.toLowerCase();
  trimemail = email.trim();
  var today = new Date();
  var year = today.getFullYear();
  
  kafka.make_request('login_topics',{"path":"ownersignup", "trimemail": trimemail, "body": req.body}, function(err,result){
    if (err){
        console.log(err);
        console.log("Database Error");
        res.status(400).json({responseMessage: 'Database Error'});
    } else if (result.status === 400) {
        console.log("Owner already exists");
        res.status(400).json({responseMessage: 'Owner already exists'});
      } else if (result.status === 201) {
        // Create token if the password matched and no error was thrown
        var token = jwt.sign({ id: result.user._id, email: result.user.email }, config.secret_key, {
          expiresIn: 7200 // expires in 2 hours
        });
        console.log("Owner profile added to traveller login");
        res.status(201).json({responseMessage: 'Owner profile added to traveller login', token: 'JWT ' + token, cookie1: 'ownercookie', cookie2: trimemail, cookie3: req.body.firstname, cookie4: req.body.lastname});
      } else if (result.status === 200) {
        console.log("Owner Added");
        // Create token if the password matched and no error was thrown
        var token = jwt.sign({ id: result.user._id, email: result.user.email }, config.secret_key, {
          expiresIn: 7200 // expires in 2 hours
        });
        res.status(200).json({responseMessage: 'Owner Added', token: 'JWT ' + token, cookie1: 'ownercookie', cookie2: trimemail, cookie3: req.body.firstname, cookie4: req.body.lastname});
      }
  })
});

// fetch user profile details
router.route('/profile').post(requireAuth, function (req, res) {
  console.log("Inside Profile fetch");
  var input_email = req.body.email;
  kafka.make_request('login_topics',{"path":"profilefetch", "input_email": input_email}, function(err,result){
    if (err){
      console.log(err);
      res.status(400).json({responseMessage: 'User not found'});
    } else {
      console.log("Profile Details:", result.user);
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.user));
    }
  })
});

// save user profile details
router.route('/profilesave').post(requireAuth, function (req, res) {
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
  kafka.make_request('login_topics',{"path": "profilesave", "input_email": trimemail, "userData": userData}, function(error,result){
    if (error) {
      console.log(error);
      console.log("unable to update database");
      res.status(400).json({responseMessage: 'unable to update database'});
    } else {
      console.log(result);
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.user));
    }
  })
});

function printSchema(obj, indent) {
  for (var key in obj) {
      if(typeof obj[key] != "function"){     //we don't want to print functions
         console.log(indent, key, typeof obj[key]) ;    
          if (typeof obj[key] == "object") {             //if current property is of object type, print its sub properties too
              printSchema(obj[key], indent + "\t");
          }
      }
  }
};

module.exports = router;