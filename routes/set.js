

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

    var start_date;
    if (req.query.start_date) {
        start_date = "'" + req.query.start_date + "'";
    }
    else {
        start_date = "NULL";
    }

    var end_date;
    if (req.query.end_date) {
        end_date = "'" + req.query.end_date + "'";
    }
    else {
        end_date = "NULL";
    }

    var sql = "INSERT INTO  `set` (`name`, `start_date`, `end_date`) VALUES ('" + req.query.name + "', " + start_date + ", " + end_date + ")";
    req.dbConnection.query(sql, function(err, rows, field) {
        if (err) throw err;

        res.json(201, {id: rows.insertId});
    });
};
