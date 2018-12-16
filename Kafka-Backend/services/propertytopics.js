var async = require('async');

var Properties = require('../models/PropertySchema');
var Bookings = require('../models/BookingSchema');

exports.propertyService = function propertyService(msg, callback){
    console.log("In Property Service path:", msg.path);
    switch(msg.path){
        case "propertylistings":
            propertylistings(msg,callback);
            break;
        case "propertysearch":
            propertysearch(msg,callback);
            break;
        case "propertysearchbyid":
            propertysearchbyid(msg,callback);
            break;
        case "triplistings":
            triplistings(msg,callback);
            break;
        case "listproperty":
            listproperty(msg,callback);
            break;
        case "bookproperty":
            bookproperty(msg,callback);
            break;
    }
};

function propertylistings(msg, callback){

    console.log("In property listings topic service. Msg: ", msg)

    var query = {}; // declare the query object
    query['$and']=[{listedBy:msg.body.listedBy}]; // filter the search by any criteria given by the user
    console.log(msg.body.fromdate);
    // if( (msg.body.fromdate && !msg.body.todate) ){
    //     console.log("here")
    //     query['$and'].push( {endDate: {$gte: msg.body.fromdate }});
    // }
    // if( (!msg.body.fromdate && msg.body.todate) ){
    //     query['$and'].push( {startDate: {$gte: msg.body.todate}});
    // }
    if( (msg.body.fromdate && msg.body.todate) ){
        query['$and'].push( {startDate: {$lte: msg.body.fromdate }}, {endDate: {$gte: msg.body.todate} });
    }

    console.log("query:", query)

    Properties.find( query )
                .limit(msg.body.pageLimit)
                .skip(msg.body.pageLimit * (msg.body.currentPage - 1) )
                .lean()
                .exec(function(error,result){
        if (error) {
            console.log(error);
            console.log("Property not found");
            callback(error, "Property not found");
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
              callback(null, {status: 200, result: result});
            }
        })
        }
    })
}

function propertysearch(msg, callback){

    console.log("In property search topic service. Msg: ", msg)

    Bookings.find( {$or:[ 
                    {$and:[ {bookedFrom:{$gte: new Date(msg.body.startDate)}}, {bookedTo:{$lte: new Date(msg.body.endDate)}}] },
                    {$and:[ {bookedTo:{$gte: new Date(msg.body.startDate)}}, {bookedTo:{$lte: new Date(msg.body.endDate)}}] },
                    {$and:[ {bookedFrom:{$gte: new Date(msg.body.startDate)}}, {bookedFrom:{$lte: new Date(msg.body.endDate)}}] },
                    {$and:[ {bookedFrom:{$lte: new Date(msg.body.startDate)}}, {bookedTo:{$gte: new Date(msg.body.endDate)}}] }
                    ]} , {propertyID: 1, _id: 0}, function(error, bookings) {

                    if (error) {
                        console.log(error);
                        console.log("Property not found");
                        callback(error, "Property not found");
                    } else {
                        var bookingsArray = [];
                        for(var i in bookings) {
                            bookingsArray.push(bookings[i].propertyID);
                        }
                        if (msg.body.bedroomsHigh === 0){
                            Properties.find( {$and: 
                                            [ {_id: {$nin: bookingsArray} }, 
                                            {city: msg.body.city.toLowerCase()}, 
                                            {startDate: {$lte: new Date(msg.body.startDate) }}, 
                                            {endDate: {$gte: new Date(msg.body.endDate)}}, 
                                            {sleeps: {$gte: msg.body.noOfGuests}}, 
                                            {$and: 
                                                [ {baseRate: {$gte: msg.body.priceLow}},
                                                  {baseRate: {$lte: msg.body.priceHigh}} 
                                            ]} 
                                            ]})
                                        .limit(msg.body.pageLimit)
                                        .skip(msg.body.pageLimit * (msg.body.currentPage - 1) )
                                        .exec(function(error,result){
                                        if (error) {
                                            console.log(error);
                                            console.log("Property not found");
                                            callback(error, "Property not found");
                                        } else {
                                            console.log("Property Found");
                                            callback(null, {status: 200, result: result});
                                        }
                                        });
                        } else {
                            Properties.find( {$and: 
                                        [ {_id: {$nin: bookingsArray} }, 
                                            {city: msg.body.city.toLowerCase()}, 
                                            {startDate: {$lte: new Date(msg.body.startDate) }}, 
                                            {endDate: {$gte: new Date(msg.body.endDate)}}, 
                                            {sleeps: {$gte: msg.body.noOfGuests}}, 
                                            {$and: 
                                                [ {baseRate: {$gte: msg.body.priceLow}}, 
                                                {baseRate: {$lte: msg.body.priceHigh}} 
                                            ]},
                                            {$and: 
                                                [ {bedrooms: {$gte: msg.body.bedroomsLow}},
                                                    {bedrooms: {$lte: msg.body.bedroomsHigh}} 
                                            ]} 
                                        ] })
                                        .limit(msg.body.pageLimit)
                                        .skip(msg.body.pageLimit * (msg.body.currentPage - 1) )
                                        .exec(function(error,result){
                                            if (error) {
                                                console.log(error);
                                                console.log("Property not found");
                                                callback(error, "Property not found");
                                            } else {
                                                console.log("Property Found");
                                                //console.log(result);
                                                callback(null, {status: 200, result: result});
                                            }
                                        })
                        }
                    }
                })
        
}

function propertysearchbyid(msg, callback){

    console.log("In search property by ID topic service. Msg: ", msg)

    Properties.findOne({_id: msg.id}, function(error,result){
        if (error) {
            console.log(error);
            console.log("Property not found");
            callback(error, "Property not found");
        } else {
            console.log("Property Found");
            callback(null, {status: 200, result: result});
        }
    })
}

function triplistings(msg, callback){

    console.log("In Trip listings topic service. Msg: ", msg)

    var query = {}; // declare the query object
    query['$and']=[{bookedBy:msg.body.bookedBy}]; // filter the search by any criteria given by the user
    // if( (msg.body.fromdate && !msg.body.todate) ){
    //     console.log("here")
    //     query['$and'].push( {bookedFrom: {$gte: msg.body.fromdate }});
    // }
    // if( (!msg.body.fromdate && msg.body.todate) ){
    //     query['$and'].push( {bookedTo: {$lte: msg.body.todate}});
    // }
    if( (msg.body.fromdate && msg.body.todate) ){
        query['$and'].push( {bookedFrom: {$lte: msg.body.fromdate }}, {bookedTo: {$gte: msg.body.todate} });
    }

    console.log("query:", query,)

    Bookings.find( query )
          .limit(msg.body.pageLimit)
          .skip(msg.body.pageLimit * (msg.body.currentPage - 1) )
          .lean()
          .exec(function(error,result){
      if (error) {
        console.log(error);
        console.log("Trips not found");
        callback(error, "Trips not found");
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
            } else {
              console.log("Trips Found");
              //console.log(result);
              callback(null, {status: 200, result});
            }
        });
    }
  })
}

function listproperty(msg, callback){

    console.log("In listing property topic service. Msg: ", msg)

    //Save the property in database
    Properties.create( msg.userData, function (error) {
        if (error) {
            console.log(error);
            console.log("unable to insert into database");
            callback(error, "unable to insert into database");
        } else {
            console.log("Property Added");
            callback(null, {status: 200});
        }
    })
}