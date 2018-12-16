var crypt = require('../models/bcrypt.js');

var Users = require('../models/UserSchema');

exports.loginService = function loginService(msg, callback){
    console.log("In Login Service path:", msg.path);
    switch(msg.path){
        case "travellerlogin":
            travellerlogin(msg,callback);
            break;
        case "ownerlogin":
            ownerlogin(msg,callback);
            break;
        case "travellersignup":
            travellersignup(msg,callback);
            break;
        case "ownersignup":
            ownersignup(msg,callback);
            break;
        case "profilefetch":
            profilefetch(msg,callback);
        case "profilesave":
            profilesave(msg,callback);
            break;
    }
};

function travellerlogin(msg, callback){

    console.log("In travellerlogin topic service. Msg: ", msg)
    Users.findOne({email:msg.trimemail}, function(err,user){
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "unable to read the database");
        } else if (user) {
            console.log("user:", user)
            crypt.compareHash(msg.password, user.password, function (err, isMatch) {
                if (isMatch && !err) {
                    console.log("Traveller Login Successful");
                    callback(null, {status: 200, user});
                } else {
                    console.log("Authentication failed. Passwords did not match");
                    callback(null, {status: 401});
                }
            })
        } else {
            console.log("Authentication failed. User does not exist.");
            callback(null, {status: 402});
        }
    })
}

function ownerlogin(msg, callback){

    console.log("In ownerlogin topic service. Msg: ", msg)
    Users.findOne({email:msg.trimemail, isOwner: 'Y'}, function(err,user){
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "unable to read the database");
        } else if (user) {
            console.log("user:", user)
            crypt.compareHash(msg.password, user.password, function (err, isMatch) {
                if (isMatch && !err) {
                    console.log("Owner Login Successful");
                    callback(null, {status: 200, user});
                } else {
                    console.log("Authentication failed. Passwords did not match");
                    callback(null, {status: 401});
                }
            })
        } else {
            console.log("Authentication failed. User does not exist.");
            callback(null, {status: 402});
        }
    })
}

function travellersignup(msg, callback){

    console.log("In traveller signup topic service. Msg: ", msg)
    Users.findOne({email:msg.trimemail}, function(err,rows){
        if (err){
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Dtaabase Error");
        } else {
            if (rows) {
            console.log("User already exists");
            callback(null, {status: 401, rows});
            } else {
                var today = new Date();
                var year = today.getFullYear();
                crypt.createHash(msg.body.password, function (response) {
                    encryptedPassword = response;
                    var userData = {
                    "firstname": msg.body.firstname,
                    "lastname": msg.body.lastname,
                    "email": msg.trimemail,
                    "password": encryptedPassword,
                    "created": year
                    }
                
                    //Save the user in database
                    Users.create( userData, function (err,user) {
                        if (err) {
                            console.log("unable to insert into database", err);
                            callback(err, "Database Error");
                        } else {
                            console.log("Traveller Signup Successful");
                            callback(null, {status: 200, user});
                        }
                    });
                })
            }
        }
    })
}

function ownersignup(msg, callback){

    Users.findOne({email:msg.trimemail}, function(err,rows){
        if (err){
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            console.log("rows", rows);
            if (rows) {
                if (rows.isOwner == 'Y') {
                    console.log("Owner already exists");
                    callback(null, {status: 400});
                } else {
                    //Update traveller as owner in database
                    Users.findOneAndUpdate({email:msg.trimemail}, {isOwner:'Y'}, function(err,user){
                        if (err) {
                            console.log(err);
                            console.log("unable to update user to owner");
                            callback(err, "Database Error");
                        } else {
                            console.log("Owner profile added to traveller login");
                            callback(null, {status: 201, user});
                        }
                    })
                }
            } else {
                var today = new Date();
                var year = today.getFullYear();
                crypt.createHash(msg.body.password, function (response) {
                    encryptedPassword = response;
                
                    var userData = {
                        "firstname": msg.body.firstname,
                        "lastname": msg.body.lastname,
                        "email": msg.trimemail,
                        "password": encryptedPassword,
                        "created": year,
                        "isOwner": 'Y'
                    }
                
                    //Save the user as owner in database
                    Users.create( userData, function (err,user) {
                        if (err) {
                            console.log(err);
                            console.log("unable to update user to owner");
                            callback(err, "Database Error");
                        } else {
                            console.log("Owner Added");
                            callback(null, {status: 200, user});
                        };
                    })
                })
            }
        }
    })
}


function profilefetch(msg, callback){

    console.log("In profile fetch topic service. Msg: ", msg)
    Users.findOne({email:msg.input_email}, function(err,user){
        if (err) {
            console.log(err);
            console.log("User not found");
            callback(err, "User not found");
        } else {
            console.log("user:", user)
            console.log("Owner Login Successful");
            callback(null, {status: 200, user});
        } 
    })
}

function profilesave(msg, callback){

    console.log("In profile save topic service. Msg: ", msg)
    Users.findOneAndUpdate({email:msg.input_email}, msg.userData, {returnNewDocument: true}, function(err,user){
        if (err) {
            console.log(err);
            console.log("unable to update database");
            callback(err, "unable to update database");
        } else {
            console.log("result:", user)
            console.log("Profile save Successful");
            callback(null, {status: 200, user});
        } 
    })
}

// function propertylistings(msg, callback){

//     console.log("In property listings topic service. Msg: ", msg)

//     var query = {}; // declare the query object
//     query['$and']=[{listedBy:msg.body.listedBy}]; // filter the search by any criteria given by the user
//     if( (msg.body.fromdate && !msg.body.todate) ){
//         console.log("here")
//         query['$and'].push( {startDate: {$gte: msg.body.fromdate }});
//     }
//     if( (!msg.body.fromdate && msg.body.todate) ){
//         query['$and'].push( {endDate: {$lte: msg.body.todate}});
//     }
//     if( (msg.body.fromdate && msg.body.todate) ){
//         query['$and'].push( {startDate: {$lte: msg.body.fromdate }}, {endDate: {$gte: msg.body.todate} });
//     }

//     console.log("query:", query)

//     Properties.find( query )
//                 .limit(msg.body.pageLimit)
//                 .skip(msg.body.pageLimit * (msg.body.currentPage - 1) )
//                 .lean()
//                 .exec(function(error,result){
//         if (error) {
//             console.log(error);
//             console.log("Property not found");
//             callback(error, "Property not found");
//         } else {
//             async.eachOfSeries (result, function(value, i, inner_callback) {
//             value.bookedFrom = []
//             value.bookedTo = []
//             value.bookedBy = []
//             value.noOfGuests = []
//             value.price = []
//             Bookings.find( { "propertyID": value._id }, function(error, bookings) {
//               if (!error){
//                 if (bookings){
//                   bookings.forEach ( function(bookingResult) {
//                     var tempbookedFrom = bookingResult.bookedFrom.getFullYear() + '-' + (bookingResult.bookedFrom.getMonth()+1) + '-' + bookingResult.bookedFrom.getDate()
//                     value.bookedFrom.push(tempbookedFrom)
//                     var tempbookedTo = bookingResult.bookedTo.getFullYear() + '-' + (bookingResult.bookedTo.getMonth()+1) + '-' + bookingResult.bookedTo.getDate()
//                     value.bookedTo.push(tempbookedTo)
//                     value.bookedBy.push(bookingResult.travellerName)
//                     value.noOfGuests.push(bookingResult.NoOfGuests)  
//                     value.price.push(bookingResult.price)
//                 });
//                }
//                inner_callback(null);
//               } else {
//                 console.log("Error while performing Query");
//                 inner_callback(error);
//               }
//             });
//           }, function (error) {
//             if (error) {
//               console.log(error);
//             } else {
//               console.log("Property Found");
//               console.log(result);
//               callback(null, {status: 200, result});
//             }
//         })
//         }
//     })
// }

// function triplistings(msg, callback){

//     console.log("In Trip listings topic service. Msg: ", msg)

//     var query = {}; // declare the query object
//     query['$and']=[{bookedBy:msg.body.bookedBy}]; // filter the search by any criteria given by the user
//     if( (msg.body.fromdate && !msg.body.todate) ){
//         console.log("here")
//         query['$and'].push( {bookedFrom: {$gte: msg.body.fromdate }});
//     }
//     if( (!msg.body.fromdate && msg.body.todate) ){
//         query['$and'].push( {bookedTo: {$lte: msg.body.todate}});
//     }
//     if( (msg.body.fromdate && msg.body.todate) ){
//         query['$and'].push( {bookedFrom: {$lte: msg.body.fromdate }}, {bookedTo: {$gte: msg.body.todate} });
//     }

//     console.log("query:", query,)

//     Bookings.find( query )
//           .limit(msg.body.pageLimit)
//           .skip(msg.body.pageLimit * (msg.body.currentPage - 1) )
//           .lean()
//           .exec(function(error,result){
//       if (error) {
//         console.log(error);
//         console.log("Trips not found");
//         callback(error, "Trips not found");
//       } else {
//         async.eachOfSeries (result, function(value, i, inner_callback) {
//           console.log("Property ID: ", value.propertyID)
//           value.propertyDetails= [];
//           Properties.find( {_id: value.propertyID}, function(error, property) {
//             if (!error){
//               if (property){
//                 value.propertyDetails.push(property[0]);
//               }
//               inner_callback(null);
//             } else {
//               console.log(error);
//               console.log("Error while performing Query");
//               inner_callback(error);
//             }
//           });
//         }, function (error) {
//             if (error) {
//               console.log(error);
//             } else {
//               console.log("Trips Found");
//               console.log(result);
//               callback(null, {status: 200, result});
//             }
//         });
//     }
//   })
// }