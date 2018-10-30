var mongoose = require('mongoose');

//schema
var EmailSchema = new mongoose.Schema({
    Sender : {
        type : String, required : true
    },
    SenderEmailAddress : {
        type : String, required : true
    },
    Receiver : {
        type : String, required : true
    },
    TimeReceived : {
        type : String, required : true
    },
    MailContent : {
        type : String, required : true
    },
    PropertyID : {
        type : String, required : false
    },
    City : {
        type : String, required : false
    },
    PropertyHeader : {
        type : String, required : false
    },
    Arrivaldate : {
        type : String, required : false
    },
    Departdate : {
        type : String, required : false
    },
    Guests: {
        type : String, required : false
    }, 
    Replied: {
        type : Boolean, required : true
    }
})

module.exports = mongoose.model('Emails', EmailSchema);