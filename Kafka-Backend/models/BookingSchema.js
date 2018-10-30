var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
BookingSchema = new Schema({
  bookedBy: {
    type: String,
    default: ''
  },
  travellerName: {
    type: String,
    default: ''
  },
  bookedFrom: {
    type: Date,
    default: ''
  },
  bookedTo: {
    type: Date,
    default: ''
  },
  propertyID: {
    type: String,
    default: ''
  },
  NoOfGuests: {
    type: Number,
    default: ''
  },
  price: {
    type: Number,
    default: ''
  },
});
    
module.exports = mongoose.model('Bookings', BookingSchema); 