var express = require('express');
var router = express.Router();
var config = require('../../config/settings');
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
  //Save the property in database
  Properties.create( userData, function (error) {
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
  Bookings.find( {$or:[ 
                      {$and:[ {bookedFrom:{$gte: new Date(req.body.startDate)}}, {bookedTo:{$lte: new Date(req.body.endDate)}}] },
                      {$and:[ {bookedTo:{$gte: new Date(req.body.startDate)}}, {bookedTo:{$lte: new Date(req.body.endDate)}}] },
                      {$and:[ {bookedFrom:{$gte: new Date(req.body.startDate)}}, {bookedFrom:{$lte: new Date(req.body.endDate)}}] },
                      {$and:[ {bookedFrom:{$lte: new Date(req.body.startDate)}}, {bookedTo:{$gte: new Date(req.body.endDate)}}] }
                ]} , {propertyID: 1, _id: 0}, function(error, bookings) {
    if (error) {
      console.log(error);
      console.log("unable to search database");
      res.status(400).json({responseMessage: 'unable to search database'});
    } else {
      var bookingsArray = [];
      for(var i in bookings) {
        bookingsArray.push(bookings[i].propertyID);
      }
      if (req.body.bedroomsHigh === 0){
        console.log("in if");
        Properties.find( {$and: [ {_id: {$nin: bookingsArray} }, {city: req.body.city.toLowerCase()}, {startDate: {$lte: Date(req.body.startDate) }}, {endDate: {$gte: Date(req.body.endDate)}}, {sleeps: {$gte: req.body.noOfGuests}}, {$and: [ {baseRate: {$gte: req.body.priceLow}}, {baseRate: {$lte: req.body.priceHigh}} ] } ] }, function(error,result){
          if (error) {
            console.log(error);
            console.log("unable to search database");
            res.status(400).json({responseMessage: 'unable to search database'});
          } else {
            //console.log(JSON.stringify(result));
            res.writeHead(200, {'content-type':'application/json'});
            res.end(JSON.stringify(result));
            console.log("Property Found"); 
          }
        });
      } else {
        Properties.find( {$and: [ {_id: {$nin: bookingsArray} }, {city: req.body.city.toLowerCase()}, {startDate: {$lte: Date(req.body.startDate) }}, {endDate: {$gte: Date(req.body.endDate)}}, {sleeps: {$gte: req.body.noOfGuests}}, {$and: [ {baseRate: {$gte: req.body.priceLow}}, {baseRate: {$lte: req.body.priceHigh}} ] }, {$and: [ {bedrooms: {$gte: req.body.bedroomsLow}}, {bedrooms: {$lte: req.body.bedroomsHigh}} ] } ] }, function(error,result){
          if (error) {
            console.log(error);
            console.log("unable to search database");
            res.status(400).json({responseMessage: 'unable to search database'});
          } else {
            //console.log(JSON.stringify(result));
            res.writeHead(200, {'content-type':'application/json'});
            res.end(JSON.stringify(result));
            console.log("Property Found"); 
          }
        });
      }
    }    
  });
});

// Search Property by id to fetch property details
router.route('/property/:id').get(function (req, res) {
  console.log(req.params.id);
  Properties.findOne({_id:req.params.id}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Property not found");
      res.status(400).json({responseMessage: 'Property not found'});
    } else {
      console.log(JSON.stringify(result));
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result));
      console.log("Property Details Found");
    }
  });    
});

// Search Booking by id
router.route('/bookings/:id').get(requireAuth, function (req, res) {
  console.log(req.params.id);
  Properties.findOne({_id:ObjectId(req.params.id)}, function(error,result){
    if (error) {
      console.log(error);
      console.log("Booking not found");
      res.status(400).json({responseMessage: 'Booking not found'});
    } else {
      console.log(JSON.stringify(result));
      res.writeHead(200, {'content-type':'application/json'});
      res.end(JSON.stringify(result));
      console.log("Booking Details Found");
    }
  });    
});

// List Property by owner
router.route('/owner/propertylistings').post(requireAuth, function (req, res) {
  console.log("req.body:", req.body);
  
  var query = {}; // declare the query object
  query['$and']=[{listedBy:req.body.listedBy}]; // filter the search by any criteria given by the user
  if( (req.body.fromdate && !req.body.todate) ){
    console.log("here")
    query['$and'].push( {startDate: {$gte: req.body.fromdate }});
  }
  if( (!req.body.fromdate && req.body.todate) ){
    query['$and'].push( {endDate: {$lte: req.body.todate}});
  }
  if( (req.body.fromdate && req.body.todate) ){
    query['$and'].push( {startDate: {$lte: req.body.fromdate }}, {endDate: {$gte: req.body.todate} });
  }

  console.log("query:", query)

  Properties.find( query )
            .limit(req.body.pageLimit)
            .skip(req.body.pageLimit * (req.body.currentPage - 1) )
            .lean()
            .exec(function(error,result){
    if (error) {
      console.log(error);
      console.log("Property not found");
      res.status(400).json({responseMessage: 'Property not found'});
    } else {
      async.eachOfSeries (result, function(value, i, inner_callback) {
        value.bookedFrom = []
        value.bookedTo = []
        value.bookedBy = []
        value.noOfGuests = []
        value.price = []
        Bookings.find( { "propertyID": value._id }, function(error, bookings) {
          if (!error){
            if (bookings){
              bookings.forEach ( function(bookingResult) {
                //console.log("bookingResult: ", bookingResult)
                var tempbookedFrom = bookingResult.bookedFrom.getFullYear() + '-' + (bookingResult.bookedFrom.getMonth()+1) + '-' + bookingResult.bookedFrom.getDate()
                value.bookedFrom.push(tempbookedFrom)
                var tempbookedTo = bookingResult.bookedTo.getFullYear() + '-' + (bookingResult.bookedTo.getMonth()+1) + '-' + bookingResult.bookedTo.getDate()
                value.bookedTo.push(tempbookedTo)
                value.bookedBy.push(bookingResult.travellerName)
                value.noOfGuests.push(bookingResult.NoOfGuests)  
                value.price.push(bookingResult.price)
            });
           }
           inner_callback(null);
          } else {
            console.log("Error while performing Query");
            inner_callback(error);
          }
        });
      }, function (error) {
        if (error) {
          console.log(error);
        } else {
          console.log("Property Found");
          //console.log(result);
          res.writeHead(200, {'content-type':'application/json'});
          res.end(JSON.stringify(result));
        }
      });
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
  console.log(req.body);

  var query = {}; // declare the query object
  query['$and']=[{bookedBy:req.body.bookedBy}]; // filter the search by any criteria given by the user
  if( (req.body.fromdate && !req.body.todate) ){
    console.log("here")
    query['$and'].push( {bookedFrom: {$gte: req.body.fromdate }});
  }
  if( (!req.body.fromdate && req.body.todate) ){
    query['$and'].push( {bookedTo: {$lte: req.body.todate}});
  }
  if( (req.body.fromdate && req.body.todate) ){
    query['$and'].push( {bookedFrom: {$lte: req.body.fromdate }}, {bookedTo: {$gte: req.body.todate} });
  }

  console.log("query:", query,)
  Bookings.find( query )
          .limit(req.body.pageLimit)
          .skip(req.body.pageLimit * (req.body.currentPage - 1) )
          .lean()
          .exec(function(error,result){
      if (error) {
        console.log(error);
        console.log("Trips not found");
        res.status(400).json({responseMessage: 'Property not found'});
      } else {
        async.eachOfSeries (result, function(value, i, inner_callback) {
          console.log("Property ID: ", value.propertyID)
          value.propertyDetails= [];
          Properties.find( {_id: value.propertyID}, function(error, property) {
            if (!error){
              if (property){
                value.propertyDetails.push(property[0]);
              }
              inner_callback(null);
            } else {
              console.log(error);
              console.log("Error while performing Query");
              inner_callback(error);
            }
          });
      }, function (error) {
        if (error) {
          console.log(error);
          console.log("Trips not found");
          res.status(400).json({responseMessage: 'Trips not found'});
        } else {
          console.log(JSON.stringify(result.length));
          res.writeHead(200, {'content-type':'application/json'});
          res.end(JSON.stringify(result));
          console.log("Trips Found");
        }
      });
    }
  })
});

module.exports = router;