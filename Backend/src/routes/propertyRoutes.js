var express = require('express');
var router = express.Router();
var kafka = require('../routes/kafka/client');

var Properties = require('../models/PropertySchema');
var Bookings = require('../models/BookingSchema');
var async = require('async');

// Set up middleware
var passport = require('passport');
var requireAuth = passport.authenticate('jwt', {session: false});

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads');
  },
  filename: (req, file, callback) => {
    fileExtension = file.originalname.split('.')[1] // get file extension from original file
    callback(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + fileExtension);
  },
});
var upload = multer({ storage : storage })


// Add Property
router.route('/owner/listproperty').post(upload.array('uploadedPhoto',5), requireAuth, function (req, res) {

  console.log(req.files);

  let filenamearray =[];
  req.files.forEach(file => {filenamearray.push(file.filename);});
  console.log(filenamearray);

  var stringObj = JSON.stringify(filenamearray);
  console.log(stringObj);
  console.log("In Owner Property Post");

  var userData = {
    listedBy: req.body.listedBy,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    streetAddress: req.body.streetAddress,
    city: req.body.city.toLowerCase(),
    state: req.body.state.toLowerCase(),
    country: req.body.country.toLowerCase(),
    zipcode: req.body.zipcode,
    headline: req.body.headline,
    description: req.body.description,
    propertyType: req.body.propertyType,
    bedrooms: req.body.bedrooms,
    sleeps: req.body.sleeps,
    bathrooms: req.body.bathrooms,
    baseRate: req.body.baseRate,
    currency: req.body.currency,
    minStay: req.body.minStay,
    amenities: req.body.amenities,
    image1:  (req.files.length >= 1) ?req.files[0].filename:"",
    image2:  (req.files.length >= 2) ?req.files[1].filename:"",
    image3:  (req.files.length >= 3) ?req.files[2].filename:"",
    image4:  (req.files.length >= 4) ?req.files[3].filename:"",
    image5:  (req.files.length >= 5) ?req.files[4].filename:"",
  }

  console.log(userData.image1);
  kafka.make_request('property_topic',{"path":"listproperty", "userData": userData}, function(error){
    if (error) {
      console.log(error);
      console.log("unable to insert into database");
      res.status(400).json({responseMessage: 'unable to insert into database'});
    } else {
      console.log("Property Added");
      res.status(200).json({responseMessage: 'Property Added'});
    }
  });    
});

// Search Property
router.route('/property/search').post(function (req, res) {
  console.log(req.body)
  kafka.make_request('property_topic',{"path":"propertysearch", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("unable to search database");
      res.status(400).json({responseMessage: 'unable to search database'});
    } else if (result.status === 200) {
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
    }    
  });
});

// Search Property by id to fetch property details
router.route('/property/:id').get(function (req, res) {
  console.log(req.params.id);
  kafka.make_request('property_topic',{"path":"propertysearchbyid", "id": req.params.id}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Property not found");
      res.status(400).json({responseMessage: 'Property not found'});
    } else {
      console.log(JSON.stringify(result.result));
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
      console.log("Property Details Found");
    }
  });    
});

// Search Booking by id
// router.route('/bookings/:id').get(requireAuth, function (req, res) {
//   console.log(req.params.id);
//   Properties.findOne({_id:ObjectId(req.params.id)}, function(error,result){
//     if (error) {
//       console.log(error);
//       console.log("Booking not found");
//       res.status(400).json({responseMessage: 'Booking not found'});
//     } else {
//       console.log(JSON.stringify(result));
//       res.writeHead(200, {'content-type':'application/json'});
//       res.end(JSON.stringify(result));
//       console.log("Booking Details Found");
//     }
//   });    
// });

// List Property by owner
router.route('/owner/propertylistings').post(requireAuth, function (req, res) {

  console.log("In Owner property Listings Route");
  console.log("req.body:", req.body);
  
  kafka.make_request('property_topic',{"path":"propertylistings", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Property not found");
      res.status(400).json({responseMessage: 'Property not found'});
    } else {
        console.log("Property Found");
        console.log(result.result);
        res.writeHead(200, {'content-type':'application/json'});
        res.end(JSON.stringify(result.result));
    }
  })
});

// Book Property
router.route('/bookproperty').post(requireAuth, function (req, res) {
  console.log("In Property Booking");
  var userData = {
    bookedBy: req.body.bookedBy,
    travellerName: req.body.travellerName,
    bookedFrom: req.body.bookedFrom,
    bookedTo: req.body.bookedTo,
    propertyID: req.body.propertyid,
    NoOfGuests : req.body.NoOfGuests,
    price: req.body.pricePaid,
  }
  console.log(userData);
  Bookings.create( userData, function (error,result) {
    if (error) {
      console.log(error);
      console.log("unable to insert into bookings database");
      res.status(400).json({responseMessage: 'unable to insert into bookings database'});
    } else {
      console.log(result);
      console.log("Booking Added");
      res.status(200).json({responseMessage: 'Booking Added'});
    }
  });    
});

// List all trips by a traveller
router.route('/traveller/triplistings').post(requireAuth, function (req, res) {

  console.log("In Traveller Trip Listings Route");
  console.log(req.body);

  kafka.make_request('property_topic',{"path":"triplistings", "body": req.body}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Trips not found");
      res.status(400).json({responseMessage: 'Trips not found'});
    } else {
      console.log("Trips Found");
      console.log(result.result);
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result.result));
    }
  })
});

module.exports = router;