/*
 * GET all photos in a set
 * Params
 *   set_id - the set id
 * TODO: Should only return sets user has access to
 */
exports.list = function(req, res) {
    // Make sure we have a set id passed in
    if (!req.query.set_id) {
        res.json(400, {error: "A set_id is required"});
        return;
    }


    // Make sure we have a valid set id
    req.dbConnection.query("SELECT * FROM  `set` WHERE `id` = '" + req.query.set_id + "' LIMIT 1", function(err, rows, field) {
        if (err) throw err;

        // We don't have a valid set_id
        if (rows.length === 0) {
            res.json(404, {error: "set_id not found"});
            return;
        }

        req.dbConnection.query("SELECT * FROM  `photo` WHERE `set_id` = '" + req.query.set_id + "'", function(err, rows, field) {
            if (err) throw err;

            res.json(rows);
        });
    });
};

/*
 * GET a single photo
 * Params:
 *   id - the photo id
 * TODO: Should only return a set if user has access to it
 */
exports.single = function(req, res) {
    if (!req.params.id) {
        res.json(400, {error: "An id is required"});
        return;
    }

    // Make sure we have a valid set id
    req.dbConnection.query("SELECT * FROM  `photo` WHERE `id` = '" + req.params.id + "' LIMIT 1", function(err, rows, field) {
        if (err) throw err;

        // Nothing with that id
        if (rows.length === 0) {
            res.json(404, {error: "Photo not found with that id"});
            return;
        }

        res.json(rows[0]);
    });
};

/*
 * POST a new photo
 * Params:
 *   set_id - The id of the set the photo is in (required)
 *   description - A description of the photo
 * TODO: Assign to current user instead of default user
 */
exports.create = function(req, res) {
    if (!req.query.set_id || req.query.set_id.length === 0) {
        res.json(400, {error: "A set_id is required"});
        return;
    }

    var description;
    if (req.query.description) {
        description = "'" + req.query.description + "'";
    }
    else {
        description = "NULL";
    }

    var sql = "INSERT INTO  `photo` (`set_id`, `owner_id`, `description`) VALUES ('" + req.query.set_id + "', " + 1 + ", " + description + ")";
    req.dbConnection.query(sql, function(err, rows, field) {
        if (err) throw err;

        res.json(201, {id: rows.insertId});
    });
};

/*
 * POST a current photo to update it
 * Params:
 *   id - The id of the photo (required)
 *   description - A description of the photo
 */
exports.update = function(req, res) {
    if (!req.params.id) {
        res.json(400, {error: "An id is required"});
        return;
    }

    var description;
    if (req.query.description) {
        description = "'" + req.query.description + "'";
    }
    else {
        description = "NULL";
    }

    var sql = "UPDATE `photo` SET `description` = " + description + " WHERE `id` = " + req.params.id + " LIMIT 1";
    req.dbConnection.query(sql, function(err, rows, field) {
        if (err) throw err;

        if (rows.affectedRows === 0) {
            res.json(404, {error: "Photo not found with that id"});
        }
        else {
            res.json(200, {message: "Update complete"});
        }
    });
};
