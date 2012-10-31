var db = require('../utils/database');

/*
 * GET all sets
 * TODO: Should only return sets user has access to
 */
exports.list = function(req, res) {
    db.connection.query("SELECT * FROM  `set`", function(err, rows, field) {
        if (err) throw err;

        res.json(rows);
    });

};

/*
 * GET a single set
 * Params:
 *   id - the set id
 * TODO: Should only return a set if user has access to it
 */
exports.single = function(req, res) {
    db.connection.query("SELECT * FROM  `set` WHERE `id` = '" + req.params.id + "' LIMIT 1", function(err, rows, field) {
        if (err) throw err;

        if (rows.length === 0) {
            res.json(404, {error: "No set found with that id"});
            return;
        }

        res.json(rows[0]);
    });
};
