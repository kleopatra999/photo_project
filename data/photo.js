var db = require("../utils/database").connect();

/**
 * Returns all the photos under a specific setId
 **/
var getAllBySetId = function(req, setId, done) {
    // Check for invalid inputs
    if (!setId) return done(NO_SET_ID, null);
    // TODO: Should validate the format of the setId

    var query = "SELECT * FROM `set` WHERE `id` = '" + setId + "' LIMIT 1";
    req.dbConnection.query(query, function(err, rows, field) {
        if (err) return done(err, null); // Unknown error

        if (rows.length === 0) return done(SET_NOT_FOUND, null); // We don't have a valid setId

        var photoQuery = "SELECT * FROM `photo` WHERE `set_id` = '" + setId + "'";
        req.dbConnection.query(photoQuery, function(err, rows, field) {
            if (err) return done(err, null);

            done(null, rows);
        });
    });
};
// Get all by set id errors
var NO_SET_ID = "No setId supplied";
var SET_NOT_FOUND = "No set with that ID";

/**
 * Returns a single photo with the given id
 **/
var getById = function(req, id, done) {
    // Check for invalid inputs
    if (!id) return done(NO_ID, null);
    // TODO: Should validate the format of the id

    var query = "SELECT * FROM `photo` WHERE `id` = '" + id + "' LIMIT 1";
    req.dbConnection.query(query, function(err, rows, field) {
        if (err) return done(err, null); // Unknown error

        // Nothing found for the given ID
        if (rows.length === 0) return done(PHOTO_NOT_FOUND, null);

        // Return the data
        done(null, rows[0]);
    });
};
// Get by ID errors
var NO_ID = "No id was supplied";
var PHOTO_NOT_FOUND = "No photo found with that ID";

/**
 * Deletes the photo with the given ID
 **/
var deleteById = function(req, id, done) {
    // Check for invalid inputs
    if (!id) return done(NO_ID, false);
    // TODO: Should validate the format of the id

    var query = "DELETE FROM `photo` WHERE `id` = " + id + " LIMIT 1";
    req.dbConnection.query(query, function(err, rows, field) {
        if (err) return done(err, false); // Unknown error

        // Nothing found for the given ID
        if (rows.length === 0) return done(PHOTO_NOT_FOUND, false);

        // Return the data
        done(null, true);
    });
};

/**
 * Exports
 **/
module.exports = {
    'getAllBySetId': getAllBySetId,
    'NO_SET_ID': NO_SET_ID,
    'SET_NOT_FOUND': SET_NOT_FOUND,

    'getById': getById,
    'NO_ID': NO_ID,
    'PHOTO_NOT_FOUND': PHOTO_NOT_FOUND,

    'deleteById': deleteById
};
