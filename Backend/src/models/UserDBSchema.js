var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypt = require('../models/bcrypt.js');

//schema
UserDBSchema = new Schema({
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  created: {
    type: Number,
    default: ''
  },
  isOwner: {
    type: String,
    default: 'N'
  },
  phone: {
    type: Number,
    default: ''
  },
  aboutMe: {
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
  company: {
    type: String,
    default: ''
  },
  school: {
    type: String,
    default: ''
  },
  hometown: {
    type: String,
    default: ''
  },
  languages: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    default: ''
  },
});
    
module.exports = mongoose.model('Users', UserDBSchema); 