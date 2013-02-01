var filestore = require('../utils/filestore'),
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
    // Check for user login
    if (!req.user) return res.json(401, {error: "Need to be logged in to make this request"});

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
 * NOTE: The two methods are needed to stop mocha complaining
 */
exports.single = function(req, res) {
    exports.singleWithStatus(req, res, 200);
};
exports.singleWithStatus = function(req, res, status) {
    // Check for user login
    if (!req.user) return res.json(401, {error: "Need to be logged in to make this request"});

    photoData.getById(req, req.params.id, function(err, data) {
        // Handle any errors
        if (err) return _handleSinglePhotoError(err, res);

        // Return the data
        res.json(status, data);
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
    // Check for user login
    if (!req.user) return res.json(401, {error: "Need to be logged in to make this request"});

    // We do these before invoking the file stroe because it's such an expensive operation
    if (!req.query.set_id || req.query.set_id.length === 0) {
        return res.json(400, {error: "A set_id is required"});
    }
    if (!req.files || !req.files.photo || req.files.photo.type != "image/jpeg") {
        return res.json(400, {error: "A image/jpeg photo file upload is required"});
    }

    // Upload the images to the file store
    filestore.uploadPhoto(req.files.photo.path, function(err, urls) {
        if (err) {
            console.log('Error uploading image', err);
            return res.json(500, {error: 'Cannot upload image'});
        }

        // Create the images in the database
        photoData.create(req, req.query.set_id, req.body.description, urls, function(err, newId) {
            // Check for and deal with errors
            if (err) {
                switch (err) {
                case photoData.NO_SET_ID:
                    return res.json(400, {error: "A set_id is required"});
                case photoData.SET_NOT_FOUND:
                    return res.json(404, {error: "No set with that set_id found"});
                case photoData.NO_URLS:
                    return res.json(500, {error: "Cannot upload image"});
                default:
                    console.log("Photo create:", err);
                    return res.json(500, {error: "Unknown server error"});
                }
            }

            // A small hack so we can use the same single method
            req.params.id = newId;
            // Delegate to the single request to return the data
            exports.singleWithStatus(req, res, 201);
        });
    });
};

/*
 * POST a current photo to update it
 * Params:
 *   id - The id of the photo (required)
 *   description - A description of the photo
 * TODO: Paramters which are not passed in should not be altered
 * TODO: This should be a transaction
 */
exports.update = function(req, res) {
    // Check for user login
    if (!req.user) return res.json(401, {error: "Need to be logged in to make this request"});

    // Update the data
    photoData.updateById(req, req.params.id, req.body.description, function(err) {
        // Handle any errors
        if (err) {
            if (err === photoData.NO_DESCRIPTION) {
                // Just return the data if no description is provided
                exports.single(req, res);
            }
            else {
                return _handleSinglePhotoError(err, res);
            }
        }

        // Delegate to the single request to return the data
        exports.single(req, res);
    });
};

/*
 * DELETE a current photo
 * Params:
 *   id - The id of the photo (required)
 * TODO: Only allow the owning user to do this
 */
exports.del = function(req, res) {
    // Check for user login
    if (!req.user) return res.json(401, {error: "Need to be logged in to make this request"});
    
    photoData.deleteById(req, req.params.id, function(err) {
        // Handle any errors
        if (err) return _handleSinglePhotoError(err, res);
        // Delete successful
        res.json(200, {message: "Delete complete"});
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
