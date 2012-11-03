var sqlUtils = require('../utils/sql');

/*
 * GET all sets
 * TODO: Should only return sets user has access to
 */
exports.list = function(req, res) {
    req.dbConnection.query("SELECT * FROM  `set`", function(err, rows, field) {
        if (err) throw err;

        res.json(rows);
    });

};

/*
 * GET a single set
 * Params:
 *   id - the set id (required)
 * TODO: Should only return a set if user has access to it
 */
exports.single = function(req, res) {
    req.dbConnection.query("SELECT * FROM  `set` WHERE `id` = '" + req.params.id + "' LIMIT 1", function(err, rows, field) {
        if (err) throw err;

        if (rows.length === 0) {
            res.json(404, {error: "No set found with that id"});
            return;
        }

        res.json(rows[0]);
    });
};

/*
 * POST a new set
 * Params:
 *   name - The name of the set (required)
 *   start_date - The start of the event (YYYY-MM-DD)
 *   end_date - The end of the event (YYYY-MM-DD)
 * TODO: Assign to current user instead of default user
 */
exports.create = function(req, res) {
    if (!req.query.name || req.query.name.length === 0) {
        res.json(400, {error: "A name is required"});
        return;
    }

    // Get the values ready for adding to SQL
    var name = sqlUtils.wrapQuotesOrNull(req.query.name);
    var start_date = sqlUtils.wrapQuotesOrNull(req.query.start_date);
    var end_date = sqlUtils.wrapQuotesOrNull(req.query.end_date);

    var sql = "INSERT INTO  `set` (`name`, `start_date`, `end_date`) VALUES (" + name + ", " + start_date + ", " + end_date + ")";
    req.dbConnection.query(sql, function(err, rows, field) {
        if (err) throw err;

        res.json(201, {id: rows.insertId});
    });
};

/*
 * POST an update to a set
 * Params:
 *   id - The id of the set (required)
 *   name - The name of the set
 *   start_date - The start of the event
 *   end_date - The end of the event
 * TODO: Paramters which are not passed in should not be altered
 */
exports.update = function(req, res) {
    if (!req.params.id || req.params.id.length === 0) {
        res.json(400, {error: "An id is required"});
        return;
    }

    // Get the values ready for adding to SQL
    var name = sqlUtils.wrapQuotesOrNull(req.query.name);
    var start_date = sqlUtils.wrapQuotesOrNull(req.query.start_date);
    var end_date = sqlUtils.wrapQuotesOrNull(req.query.end_date);

    var sql = "UPDATE `set` SET `name` = " + name + ", `start_date` = " + start_date + ", `end_date` = " + end_date + " WHERE `id` = " + req.params.id + " LIMIT 1";
    req.dbConnection.query(sql, function(err, rows, field) {
        if (err) throw err;

        if (rows.affectedRows === 0) {
            res.json(404, {error: "No set found with that id"});
        }
        else {
            res.json(200, {message: "Update complete"});
        }
    });
};

/*
 * DELETE a set
 * Params:
 *   id - The id of the set (required)
 * TODO: Only allow the owning user to do this
 */
exports.delete = function(req, res) {
    if (!req.params.id) {
        res.json(400, {error: "An id is required"});
        return;
    }

    var sql = "DELETE FROM `set` WHERE `id` = " + req.params.id + " LIMIT 1";
    req.dbConnection.query(sql, function(err, rows, field) {
        if (err) throw err;

        if (rows.affectedRows === 0) {
            res.json(404, {error: "Set not found with that id"});
        }
        else {
            res.json(200, {message: "Delete complete"});
        }
    });
};
