'use strict';
const passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var Users = require('../src/models/UserSchema');
var config = require('./settings');

// Setup work and export for the JWT passport strategy
var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: config.secret_key
};
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log("JWT Payload:", jwt_payload);
    Users.findOne({email:jwt_payload.email}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            delete user.password;
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

module.exports = passport;
    