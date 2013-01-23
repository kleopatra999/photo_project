var db = require("../utils/database").connect();

var getByEmail = function(userEmail, done) {
    // Check for invalid inputs
    if (!userEmail) {
        done("No user email supplied", null);
        return;
    }
    // TODO: Should validate the format of the email

    var query = "SELECT * FROM `user` WHERE `email` = '" + userEmail + "' LIMIT 1";

    db.query(query, function(err, rows, field) {
        // Check for SQL error
        if (err) {
            done("SQL error: " + err, null);
            return;
        }
        // No user was returned
        else if (rows.length === 0) {
            done("No user with that email", null);
            return;
        }

        // Return the user
        var user = rows[0];
        done(null, user);
    });
};

var getById = function(userId, done) {
    // Check for invalid inputs
    if (!userId) {
        done("No user id supplied", null);
        return;
    }

    var query = "SELECT * FROM `user` WHERE `id` = '" + userId + "' LIMIT 1";

    db.query(query, function(err, rows, field) {
        // Check for SQL error
        if (err) {
            done("SQL error: " + err, null);
            return;
        }
        // No user was returned
        else if (rows.length === 0) {
            done("No user with that ID", null);
            return;
        }

        // Return the user
        var user = rows[0];
        done(null, user);
    });
};

module.exports = {
    'getByEmail': getByEmail,
    'getById': getById
};
