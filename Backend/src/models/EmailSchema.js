var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
EmailSchema = new Schema({
    sender : {
        type : String, 
    },
    senderEmailAddress : {
        type : String, 
    },
    receiver : {
        type : String,
    },
    timeReceived : {
        type : String,
    },
    mailContent : {
        type : String,
    },
    propertyID : {
        type : String,
    },
    city : {
        type : String,
    },
    propertyHeadline : {
        type : String,
    },
    arrivalDate : {
        type : String, 
    },
    departDate : {
        type : String, 
    },
    noOfGuests: {
        type : String
    }, 
    replied: {
        type : Boolean
    }
})

module.exports = mongoose.model('Emails', EmailSchema);