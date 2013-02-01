var sqlUtils = require('../utils/sql');

/**
 * Returns all the photos under a specific setId
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
 * Errors
 **/

/**
 * Exports
 **/
module.exports = {
    'getAll': getAll
};
