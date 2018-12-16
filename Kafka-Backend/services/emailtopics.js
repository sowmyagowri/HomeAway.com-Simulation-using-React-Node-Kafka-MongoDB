var Emails = require('../models/EmailSchema');

exports.emailService = function emailService(msg, callback){
    console.log("In Login Service path:", msg.path);
    switch(msg.path){
        case "sendmail":
            sendmail(msg,callback);
            break;
        case "getemails":
            getemails(msg,callback);
            break;
        case "getsentemails":
            getsentemails(msg,callback);
            break;
    }
};

function sendmail(msg, callback){

    console.log("In sendmail topic service. Msg: ", msg)
    Emails.findOneAndUpdate({_id : msg.id}, {$set : msg.reply}, function(error, response) {
        if (error) {
            console.log(error);
            console.log("unable to update replied status");
            callback(err, "unable to update replied status");
        } else {
            console.log("Email Updated as Replied")
        }
    })

    Emails.create(msg.data, function(error, result) {
        if (error) {
            console.log(error);
            console.log("unable to insert into database");
            callback(err, "unable to insert into database");
        } else {
            console.log("Email Added");
            callback(null, {status: 200});
        }
    })
}

function getemails(msg, callback){

    console.log("In getemails topic service. Msg: ", msg)
    
    Emails.find({receiver: msg.receiver},function(error, result) {
        if (error) {
            console.log(error);
            callback(err, "No emails");  
        } else {
            console.log(result);
            callback(null, {status: 200, result});
        }
    })
}

function getsentemails(msg, callback){

    console.log("In get sent emails topic service. Msg: ", msg)
    
    Emails.find({senderEmailAddress: msg.senderEmailAddress},function(error, result) {
        if (error) {
            console.log(error);
            callback(err, "No emails");  
        } else {
            console.log(result);
            callback(null, {status: 200, result});
        }
    })
}
