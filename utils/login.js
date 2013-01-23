var crypto = require('crypto'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    userData = require('../data/user');

// Sets up passport with the right strategy and serializer
var setup = function() {
    // Sets up the passport login
    var localStrategy = new LocalStrategy({usernameField: 'email'}, getAndCheckUser);
    passport.use(localStrategy);

    // Tells passport how to serialise a user object
    passport.serializeUser(serializeUser);

    // Tells passport how to deserialise a cookie into a user object
    passport.deserializeUser(deserializeUser);
};
// Gets the user by email and checks the password is valid
var getAndCheckUser = function(email, password, done) {
    userData.getByEmail(email, function(err, user) {
        // Will error if no such user
        if (err) {
            return done(null, false, {message: 'Incorrect email'});
        }

        // Check password is correct
        var shasum = crypto.createHash('sha1');
        shasum.update(password);
        var userPasswordHash = shasum.digest('hex');
        var dbPasswordHash = user.password;
        if (userPasswordHash != dbPasswordHash) {
            return done(null, false, {message: 'Incorrect password'});
        }

        // Log the user in!
        return done(null, user);
    });
};
// Turns the user object into a string
var serializeUser = function(user, done) {
    done(null, user.id);
};
// Turns a string into a user object
var deserializeUser = function(id, done) {
    userData.getById(id, function(err, user) {
        done(err, user);
    });
};

// A route to use when the user makes a POST request to login
var postLoginRoute = passport.authenticate('local', {successRedirect: '/'});

// A route to use when the user makes a GET request to logout
var logoutRoute = function(req, res) {
    req.logout();
    res.redirect('/');
};

module.exports = {
    'setup': setup,
    'postLoginRoute': postLoginRoute,
    'logoutRoute': logoutRoute
};
