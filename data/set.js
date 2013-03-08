var sqlUtils = require('../utils/sql'),
    userData = require('./user');
    _ = require('underscore');

/**
 * Returns all the sets
 **/
var getAll = function(req, done) {
    var query = "SELECT `set`.* FROM `set` JOIN `set_user` ON `set`.`id` = `set_user`.`set_id` WHERE `user_id` = '" + req.user.id + "'";
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

    var query = "SELECT `set`.* FROM `set` JOIN `set_user` ON `set`.`id` = `set_user`.`set_id` WHERE `user_id` = '" + req.user.id + "' AND `set`.`id` = '" + id + "' LIMIT 1";
    req.dbConnection.query(query, function(err, rows, field) {
        // Check for errors
        if (err) return done(err);
        if (rows.length === 0) return done(SET_NOT_FOUND);

        var set = rows[0];
        done(null, set);
    });
};

/**
 * Creates a new set and returns the new id
 **/
var create = function(req, name, description, startDate, endDate, done) {
    // Check for valid inputs
    if (!name || name.length === 0) return done(NO_NAME);
    if (!description || description.length === 0) return done(NO_DESCRIPTION);
    if (!startDate) return done(NO_START_DATE);
    if (!endDate) return done(NO_END_DATE);

    // Get the values ready for adding to SQL
    name = sqlUtils.wrapQuotesOrNull(name);
    description = sqlUtils.wrapQuotesOrNull(description);
    startDate = sqlUtils.wrapQuotesOrNull(startDate);
    endDate = sqlUtils.wrapQuotesOrNull(endDate);

    // Make the request
    var sql = "INSERT INTO `set` (`name`, `description`, `start_date`, `end_date`) VALUES (" + name + ", " + description + ", " + startDate + ", " + endDate + ")";
    req.dbConnection.query(sql, function(err, rows, field) {
        if (err) done(err);

        var newSetId = rows.insertId;

        var sql = "INSERT INTO `set_user` (`set_id`, `user_id`) VALUES (" + newSetId + ", " + req.user.id + ")";
        req.dbConnection.query(sql, function(err, rows, field) {
            if (err) done(err);

            // Send back the new id
            done(null, newSetId);
        });
    });
};

/**
 * Updates the set with the given id
 **/
var updateById = function(req, id, name, startDate, endDate, done) {
    // Check for valid inputs
    if (!id) return done(NO_ID);

    // Get the value list ready for adding to SQL
    var valueClauses = sqlUtils.createValueList([
        {name: 'name', value: name},
        {name: 'start_date', value: startDate},
        {name: 'end_date', value: endDate}
    ]);

    if (!valueClauses) return done(null, false);

    // Get the set first to validate that the user has access to it
    getById(req, id, function(err, set) {
        if (err) return done(SET_NOT_FOUND); // Unauthorised

        var sql = "UPDATE `set` SET " + valueClauses + " WHERE `id` = " + id + " LIMIT 1";
        req.dbConnection.query(sql, function(err, rows, field) {
            if (err) return done(err);

            if (rows.affectedRows === 0) return done(SET_NOT_FOUND);
            
            done(null, true);
        });
    });
};

/**
 * Deletes the set with the given id
 **/
var deleteById = function(req, id, done) {
    // Check for valid inputs
    if (!id) return done(NO_ID);

    // Get the set first to validate that the user has access to it
    getById(req, id, function(err, set) {
        if (err) return done(SET_NOT_FOUND); // Unauthorised

        // Make the request
        var sql = "DELETE FROM `set` WHERE `id` = " + id + " LIMIT 1";
        req.dbConnection.query(sql, function(err, rows, field) {
            // Check for and return errors
            if (err) return done(err);
            if (rows.affectedRows === 0) return done(SET_NOT_FOUND);

            // Return result
            done(null, true);
        });
    });
};

/**
 * Shared the given set with the users email
 **/
var shareById = function(req, id, email, done) {
    // Check for valid inputs
    if (!id) return done(NO_ID);
    if (!email) return done(NO_EMAIL);

    userData.getByEmail(email, function(err, user) {
        if (err) return done(EMAIL_NOT_FOUND);

        // Make the request
        var sql = "INSERT INTO `set_user` (`set_id`, `user_id`) VALUES ('" + id + "', '" + user.id + "')";
        req.dbConnection.query(sql, function(err, rows, field) {
            if (err) done(err);

            var newSetId = rows.insertId;
            done(null, newSetId);
        });
    });
};

/**
 * Errors
 **/
var NO_ID = "No id provided";
var SET_NOT_FOUND = "No set with that ID";
var EMAIL_NOT_FOUND = "No user with that email";
var NO_NAME = "A name is required";
var NO_DESCRIPTION = "A description is required";
var NO_START_DATE = "A start date is required";
var NO_END_DATE = "A end date is required";
var NO_EMAIL = "An email is required";

/**
 * Exports
 **/
module.exports = {
    'getAll': getAll,
    'getById': getById,
    'create': create,
    'updateById': updateById,
    'deleteById': deleteById,
    'shareById': shareById,

    'NO_ID': NO_ID,
    'SET_NOT_FOUND': SET_NOT_FOUND,
    'EMAIL_NOT_FOUND': EMAIL_NOT_FOUND,
    'NO_NAME': NO_NAME,
    'NO_DESCRIPTION': NO_DESCRIPTION,
    'NO_START_DATE': NO_START_DATE,
    'NO_END_DATE': NO_END_DATE,
    'NO_EMAIL': NO_EMAIL
};
