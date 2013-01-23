var crypto = require('crypto'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    userData = require('../data/user');

exports.setup = function() {
    // Sets up the passport login
    passport.use(new LocalStrategy({usernameField: 'email'}, function(email, password, done) {
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
