//Libraries
var express = require('express');
var path = require('path');
// App Instance
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');

// Log requests to console
var morgan = require('morgan');

var config = require('./config/settings');
var passport = require('passport');

console.log("Initializing passport");
app.use(passport.initialize());

// Bring in defined Passport Strategy
require('./config/passport').passport;

// Set up Database connection
var mongoose = require('mongoose');
var connStr = config.database_type + '://' + config.database_host + ':' + config.database_port + '/' + config.database_name;
mongoose.connect(connStr, { useNewUrlParser: true }, function(err) {
  if (err) throw err;
  else {
      console.log('Successfully connected to MongoDB');
  }
});

//server configuration
var basePath = '/homeaway';

//use express session to maintain session data
app.use(session({
  secret              : 'cmpe273_homeaway_mongodb',
  resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
  duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration      :  5 * 60 * 1000
}));

//Allow Access Control
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Log requests to console
app.use(morgan('dev'));

// Routes and Backend Funcioncalities
var loginRoutes = require('./src/routes/loginRoutes');
//var propertyRoutes = require('./src/routes/propertyRoutes');

app.use(express.static('public'));

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({extended: true}));

// parse application/json
app.use(bodyParser.json());

app.use(basePath, loginRoutes);
//app.use(basePath, propertyRoutes);
app.use('/uploads', express.static(path.join(__dirname, '/uploads/')));

// Execute App
app.listen(config.backend_port, () => {
  console.log('HomeAway Backend running on Port:',config.backend_port);
});