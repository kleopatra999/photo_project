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
 * Creates a new set and returns the new id
 **/
var create = function(req, name, startDate, endDate, done) {
    // Check for valid inputs
    if (!name || name.length === 0) return done(NO_NAME);
    if (!startDate) return done(NO_START_DATE);
    if (!endDate) return done(NO_END_DATE);

    // Get the values ready for adding to SQL
    name = sqlUtils.wrapQuotesOrNull(name);
    startDate = sqlUtils.wrapQuotesOrNull(startDate);
    endDate = sqlUtils.wrapQuotesOrNull(endDate);

    // Make the request
    var sql = "INSERT INTO  `set` (`name`, `start_date`, `end_date`) VALUES (" + name + ", " + startDate + ", " + endDate + ")";
    req.dbConnection.query(sql, function(err, rows, field) {
        if (err) done(err);

        // Send back the new id
        done(null, rows.insertId);
    });
};

/**
 * Errors
 **/
var NO_ID = "No id provided";
var SET_NOT_FOUND = "No set with that ID";
var NO_NAME = "A name is required";
var NO_START_DATE = "A start date is required";
var NO_END_DATE = "A end date is required";

/**
 * Exports
 **/
module.exports = {
    'getAll': getAll,
    'getById': getById,
    'create': create,

    'NO_ID': NO_ID,
    'SET_NOT_FOUND': SET_NOT_FOUND,
    'NO_NAME': NO_NAME,
    'NO_START_DATE': NO_START_DATE,
    'NO_END_DATE': NO_END_DATE
};
