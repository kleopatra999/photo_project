var db = require("../utils/database").connect(),
    sqlUtils = require('../utils/sql');

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

var create = function(email, password, name, done) {
    // check for required values
    if (!email || !password) {
        return done("No email provided");
    }
    else if (!password) {
        return done("No password provided");
    }

    // Wrap the email and name correctly
    email = sqlUtils.wrapQuotesOrNull(email);
    name = sqlUtils.wrapQuotesOrNull(name);

    var salt = makeSalt(32);
    password = salt + password;

    var sql = "INSERT INTO  `user` (`email`, `salt`, `password`, `name`) VALUES (" + email + ", '" + salt + "', SHA1('" + password + "'), " + name + ")";
    db.query(sql, function(err, rows, field) {
        // Check for SQL error
        if (err) {
            return done("SQL error: " + err, null);
        }

        // Return the new id
        var newId = rows.insertId;
        return done(null, newId);
    });
};

function makeSalt(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i = 0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = {
    'getByEmail': getByEmail,
    'getById': getById,
    'create': create
};
