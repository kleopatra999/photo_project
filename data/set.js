var sqlUtils = require('../utils/sql');

/**
 * Returns all the sets
 **/
var getAll = function(req, done) {

    var query = "SELECT * FROM  `set`";
    req.dbConnection.query(query, function(err, rows, field) {
        if (err) return done(err); // Unknown error

        // Return the rows
        done(null, rows);
    });
};

/**
 * Returns a single set with a given id
 **/
var getById = function(req, id, done) {
    // Check for valid inputs
    if (!id) return done(NO_ID, null);

    var query = "SELECT * FROM  `set` WHERE `id` = '" + id + "' LIMIT 1";
    req.dbConnection.query(query, function(err, rows, field) {
        // Check for errors
        if (err) return done(err);
        if (rows.length === 0) return done(SET_NOT_FOUND);

        done(null, rows[0]);
    });
};

/**
 * Errors
 **/
var NO_ID = "No id provided";
var SET_NOT_FOUND = "No set with that ID";

/**
 * Exports
 **/
module.exports = {
    'getAll': getAll,
    'getById': getById,

    'NO_ID': NO_ID,
    'SET_NOT_FOUND': SET_NOT_FOUND
};
