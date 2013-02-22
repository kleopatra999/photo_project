var sqlUtils = require('../utils/sql'),
    setData = require('./set');

/**
 * Returns all the photos under a specific setId
 **/
var getAllBySetId = function(req, setId, done) {
    // Check for invalid inputs
    if (!setId) return done(NO_SET_ID);
    // TODO: Should validate the format of the setId

    setData.getById(req, setId, function(err, set) {
        if (err) return done(SET_NOT_FOUND);

        var photoQuery = "SELECT * FROM `photo` WHERE `set_id` = '" + setId + "'";
        req.dbConnection.query(photoQuery, function(err, rows, field) {
            if (err) return done(err);

            done(null, rows);
        });
    });
};

/**
 * Returns a single photo with the given id
 **/
var getById = function(req, id, done) {
    // Check for invalid inputs
    if (!id) return done(NO_ID);
    // TODO: Should validate the format of the id

    var query = "SELECT * FROM `photo` WHERE `id` = '" + id + "' LIMIT 1";
    req.dbConnection.query(query, function(err, rows, field) {
        if (err) return done(err); // Unknown error
        if (rows.length === 0) return done(PHOTO_NOT_FOUND); // Nothing found for the given ID

        var photo = rows[0];

        // Get the set data to validate that the user has access to this photo
        setData.getById(req, photo.set_id, function(err, set) {
            if (err) return done(PHOTO_NOT_FOUND); // Hide that auth is the error, send 404

            // Return the data
            done(null, photo);
        });
    });
};

/**
 * Updates the photo with the given ID
 **/
var updateById = function(req, id, description, done) {
    // Check for invalid inputs
    if (!id) return done(NO_ID);
    if (!description) return done(NO_DESCRIPTION);
    // TODO: Should validate the format of the id
    // TODO: Should validate the format of the description

    // Wrap the description in quotes for the SQL statement
    description = sqlUtils.wrapQuotesOrNull(description);

    // Get the photo first to validate that the user has access to this photo
    getById(req, id, function(err, photo) {
        if (err) return done(PHOTO_NOT_FOUND); // Unauthorised

        var query = "UPDATE `photo` SET `description` = " + description + " WHERE `id` = '" + id + "' LIMIT 1";
        req.dbConnection.query(query, function(err, rows, field) {
            // Unknown error
            if (err) return done(err);

            // Nothing found for the given ID
            if (rows.affectedRows === 0) return done(PHOTO_NOT_FOUND);

            // Return the data
            done(null);
        });
    });
};

/**
 * Deletes the photo with the given ID
 **/
var deleteById = function(req, id, done) {
    // Check for invalid inputs
    if (!id) return done(NO_ID, false);
    // TODO: Should validate the format of the id

    // Get the photo first to validate that the user has access to this photo
    getById(req, id, function(err, photo) {
        if (err) return done(PHOTO_NOT_FOUND); // Unauthorised

        var query = "DELETE FROM `photo` WHERE `id` = " + id + " LIMIT 1";
        req.dbConnection.query(query, function(err, rows, field) {
            if (err) return done(err, false); // Unknown error

            // Nothing found for the given ID
            if (rows.length === 0) return done(PHOTO_NOT_FOUND, false);

            // Return the data
            done(null, true);
        });
    });
};

/**
 * Creates a photo with the given paramters
 **/
var create = function(req, setId, description, dateTaken, urls, done) {
    // Check for invalid inputs
    if (!setId) return done(NO_SET_ID);
    if (!urls) return done(NO_URLS);

    // Wrap the description and date taken up correctly
    description = sqlUtils.wrapQuotesOrNull(description);
    dateTaken = sqlUtils.wrapQuotesOrNull(dateTaken);

    // Get the set data to validate that the user has access to this photo
    setData.getById(req, setId, function(err, set) {
        if (err) return done(SET_NOT_FOUND); // Make the user think the set doesn't exist

        var sql = "INSERT INTO  `photo` (`set_id`, `owner_id`, `description`, `date_taken`, `orig_photo_url`, `small_photo_url`, `medium_photo_url`, `large_photo_url`) VALUES ('" + setId + "', " + req.user.id + ", " + description + ", " + dateTaken + ", '" + urls['orig'] + "', '" + urls['small'] + "', '" + urls['medium'] + "', '" + urls['large'] + "')";
        req.dbConnection.query(sql, function(err, rows, field) {
            if (err) {
                if (err.code === "ER_NO_REFERENCED_ROW_") {
                    return done(SET_NOT_FOUND);
                }
                else {
                    return done(err);
                }
            }

            var newId = rows.insertId;
            return done(null, newId);
        });
    });
};

/**
 * Errors
 **/
var NO_ID = "No id was supplied";
var PHOTO_NOT_FOUND = "No photo found with that ID";
var NO_DESCRIPTION = "No description was supplied";
var NO_SET_ID = "No setId supplied";
var NO_URLS = "No urls supplied";
var SET_NOT_FOUND = "No set with that ID";

/**
 * Exports
 **/
module.exports = {
    'getAllBySetId': getAllBySetId,
    'getById': getById,
    'updateById': updateById,
    'deleteById': deleteById,
    'create': create,

    'NO_SET_ID': NO_SET_ID,
    'NO_URLS': NO_URLS,
    'NO_ID': NO_ID,
    'NO_DESCRIPTION': NO_DESCRIPTION,
    'SET_NOT_FOUND': SET_NOT_FOUND,
    'PHOTO_NOT_FOUND': PHOTO_NOT_FOUND
};
