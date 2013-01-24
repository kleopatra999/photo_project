var sqlUtils = require('../utils/sql'),
    filestore = require('../utils/filestore'),
    photoData = require('../data/photo'),
    urlUtils = require('../utils/urls'),
    fs = require('fs'),
    _ = require('underscore');

/*
 * GET all photos in a set
 * Params
 *   set_id - the set id
 * TODO: Should only return sets user has access to
 */
exports.list = function(req, res) {
    // Get the data from the database using the set_id
    photoData.getAllBySetId(req, req.query.set_id, function(err, rows) {
        // Check for and deal with errors
        if (err) {
            switch (err) {
            case photoData.NO_SET_ID:
                return res.json(400, {error: "A set_id is required"});
            case photoData.SET_NOT_FOUND:
                return res.json(404, {error: "No set with that set_id found"});
            default:
                res.json(500, {error: "Unknown server error"});
                console.log("Photo List:", err);
                return;
            }
        }

        // Set the correct photo urls for all the items
        _.each(rows, function(row) {
            row.url = urlUtils.getPhotoUrl(req, row.id);
        });

        // Send the data back
        res.json(rows);
    });
};

/*
 * GET a single photo
 * Params:
 *   id - the photo id
 * TODO: Should only return a set if user has access to it
 */
exports.single = function(req, res) {
    photoData.getById(req, req.params.id, function(err, data) {
        // Handle any errors
        if (err) return _handleSinglePhotoError(err, res);
        // Return the data
        res.json(data);
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

    if (!req.files || !req.files.photo || req.files.photo.type != "image/jpeg") {
        res.json(400, {error: "A image/jpeg photo file upload is required"});
        return;
    }

    var description = sqlUtils.wrapQuotesOrNull(req.body.description);

    filestore.uploadPhoto(req.files.photo.path, function(err, urls) {
        if (err) {
            console.log('Error uploading file', err);
            res.json(500, {error: 'Cannot upload file'});
            return;
        }

        var sql = "INSERT INTO  `photo` (`set_id`, `owner_id`, `description`, `orig_photo_url`, `small_photo_url`, `medium_photo_url`, `large_photo_url`) VALUES ('" + req.query.set_id + "', " + 1 + ", " + description + ", '" + urls['orig'] + "', '" + urls['small'] + "', '" + urls['medium'] + "', '" + urls['large'] + "')";
        req.dbConnection.query(sql, function(err, rows, field) {
            if (err) {
                if (err.code === "ER_NO_REFERENCED_ROW_") {
                    res.json(404, {error: "No set with that set_id"});
                    return;
                }
                else {
                    throw err;
                }
            }

            var newId = rows.insertId;
            _getSingle(newId, req.dbConnection, function(err, data) {
                if (err) {
                    res.json(404, {error: err});
                    return;
                }

                res.json(201, data);
            });
        });
    });
};

/*
 * POST a current photo to update it
 * Params:
 *   id - The id of the photo (required)
 *   description - A description of the photo
 * TODO: Paramters which are not passed in should not be altered
 */
exports.update = function(req, res) {
    if (!req.params.id) {
        res.json(400, {error: "An id is required"});
        return;
    }
    if (!req.body.description) {
        res.json(200, {message: "No changes made"});
        return;
    }

    var description = sqlUtils.wrapQuotesOrNull(req.body.description);

    var sql = "UPDATE `photo` SET `description` = " + description + " WHERE `id` = " + req.params.id + " LIMIT 1";
    req.dbConnection.query(sql, function(err, rows, field) {
        if (err) throw err;

        if (rows.affectedRows === 0) {
            res.json(404, {error: "Photo not found with that id"});
        }
        else {
            _getSingle(req.params.id, req.dbConnection, function(err, data) {
                if (err) {
                    res.json(404, {error: err});
                    return;
                }

                res.json(200, data);
            });
        }
    });
};

/*
 * DELETE a current photo
 * Params:
 *   id - The id of the photo (required)
 * TODO: Only allow the owning user to do this
 */
exports.del = function(req, res) {
    photoData.deleteById(req, req.params.id, function(err, done) {
        // Handle any errors
        if (err) return _handleSinglePhotoError(err, res);
        // Delete successful
        res.json(200, {message: "Delete complete"});
    });
};

var _getSingle = function(id, dbConnection, callback) {
    // Make sure we have a valid set id
    dbConnection.query("SELECT * FROM  `photo` WHERE `id` = '" + id + "' LIMIT 1", function(err, rows, field) {
        if (err) {
            callback(err, null);
            return;
        }

        // Nothing with that id
        if (rows.length === 0) {
            callback("Photo not found with that id", null);
            return;
        }

        callback(null, rows[0]);
    });
};

var _handleSinglePhotoError = function(err, res) {
    switch (err) {
    case photoData.NO_ID:
        return res.json(400, {error: "An id is required"});
    case photoData.PHOTO_NOT_FOUND:
        return res.json(404, {error: "No photo with that id found"});
    default:
        res.json(500, {error: "Unknown server error"});
        console.log("Photo Single:", err);
        return;
    }
};
