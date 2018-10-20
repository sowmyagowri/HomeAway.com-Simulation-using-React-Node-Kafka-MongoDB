var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
PropertySchema = new Schema({
  listedBy: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    default: ''
  },
  endDate: {
    type: Date,
    default: ''
  },
  sleeps: {
    type: Number,
    default: 1
  },
  bedrooms: {
    type: Number,
    default: 1
  },
  bathrooms: {
    type: Number,
    default: 1
  },
  currency: {
    type: String,
    default: 'USD'
  },
  minStay: {
    type: Number,
    default: 1
  },
  baseRate: {
    type: Double,
    default: 0.00
  },
  headline: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  propertyType: {
    type: String,
    default: ''
  },
  amenities: {
    type: String,
    default: ''
  },
  streetAddress: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    default: ''
  },
  zipcode: {
    type: Number,
    default: ''
  },
  image1: {
    type: String,
    default: ''
  },
  image2: {
    type: String,
    default: ''
  },
  image3: {
    type: String,
    default: ''
  },
  image4: {
    type: String,
    default: ''
  },
  image5: {
    type: String,
    default: ''
  },
});
    
module.exports = mongoose.model('Properties', PropertySchema); 