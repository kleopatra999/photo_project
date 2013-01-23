var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    userData = require('../data/user');

exports.setup = function() {
    // Sets up the passport login
    passport.use(new LocalStrategy(function(username, password, done) {
        if (username != "testing@example.com") {
            return done(null, false, {message: 'Incorrect username.'});
        }
        else if (password != "test") {
            return done(null, false, {message: 'Incorrect password.'});
        }

        return done(null, {id: 1, email: username});
    }));

    // Tells passport how to serialise a user object
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Tells passport how to deserialise a cookie into a user object
    passport.deserializeUser(function(id, done) {
        userData.getById(id, function(err, user) {
            done(err, user);
        });
    });
};

exports.postLoginRoute = passport.authenticate('local', {
    successRedirect: '/'
});

exports.logoutRoute = function(req, res) {
    req.logout();
    res.redirect('/');
};
