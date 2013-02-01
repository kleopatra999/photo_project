var sqlUtils = require('../utils/sql'),
    setData = require('../data/set'),
    urls = require('../utils/urls'),
    _ = require('underscore');

/*
 * GET all sets
 * TODO: Should only return sets user has access to
 */
exports.list = function(req, res) {
    setData.getAll(req, function(err, rows) {
        if (err) return res.json(500, {error: 'Unknown error while getting sets'});

        _.each(rows, function(row) {
            row.url = urls.getSetUrl(req, row.id);
            row.photoUrl = urls.getPhotoListUrl(req, row.id);
        });

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
    setData.getById(req, req.params.id, function(err, set) {
        // Check for and handle errors
        if (err) {
            if (err == setData.NO_ID) {
                return res.json(400, {error: "An id is required"});
            }
            else if (err == setData.SET_NOT_FOUND) {
                return res.json(404, {error: "No set found with that id"});
            }
            else {
                console.log("Set single error:", err);
                return res.json(500, {error: "Unknown error"});
            }
        }

        // Return the set data
        set.photoUrl = urls.getPhotoListUrl(req, set.id);
        res.json(set);
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
    if (!req.body.name || req.body.name.length === 0) {
        res.json(400, {error: "A name is required"});
        return;
    }

    // Get the values ready for adding to SQL
    var name = sqlUtils.wrapQuotesOrNull(req.body.name);
    var start_date = sqlUtils.wrapQuotesOrNull(req.body.start_date);
    var end_date = sqlUtils.wrapQuotesOrNull(req.body.end_date);

    var sql = "INSERT INTO  `set` (`name`, `start_date`, `end_date`) VALUES (" + name + ", " + start_date + ", " + end_date + ")";
    req.dbConnection.query(sql, function(err, rows, field) {
        if (err) throw err;

        var newId = rows.insertId;
        res.json(201, {
            id: newId,
            url: urls.getSetUrl(req, newId)
        });
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

    // Get the value list ready for adding to SQL
    var valueClauses = sqlUtils.createValueList([
        {name: 'name', value: req.body.name},
        {name: 'start_date', value: req.body.start_date},
        {name: 'end_date', value: req.body.end_date}
    ]);

    if (!valueClauses) {
        res.json(200, {message: 'No changes made'});
        return;
    }

    var sql = "UPDATE `set` SET " + valueClauses + " WHERE `id` = " + req.params.id + " LIMIT 1";
    req.dbConnection.query(sql, function(err, rows, field) {
        if (err) throw err;

        if (rows.affectedRows === 0) {
            res.json(404, {error: "No set found with that id"});
        }
        else {
            res.json(200, {
                message: "Update complete",
                url: urls.getSetUrl(req, req.params.id)
            });
        }
    });
};

/*
 * DELETE a set
 * Params:
 *   id - The id of the set (required)
 * TODO: Only allow the owning user to do this
 */
exports.del = function(req, res) {
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
