var sqlUtils = require('../utils/sql'),
    setData = require('../data/set'),
    urls = require('../utils/urls'),
    _ = require('underscore');

/*
 * GET all sets
 * TODO: Should only return sets user has access to
 */
exports.list = function(req, res) {
    // Check for user login
    if (!req.user) return res.json(401, {error: "Need to be logged in to make this request"});

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
    exports.singleWithStatus(req, res, 200);
};
exports.singleWithStatus = function(req, res, status) {
    // Check for user login
    if (!req.user) return res.json(401, {error: "Need to be logged in to make this request"});

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
        res.json(status, set);
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
    // Check for user login
    if (!req.user) return res.json(401, {error: "Need to be logged in to make this request"});

    setData.create(req, req.body.name, req.body.description, req.body.start_date, req.body.end_date, function(err, newId) {
        // Check for and handle errors
        if (err) {
            switch (err) {
            case setData.NO_NAME:
                return res.json(400, {error: "A name is required"});
            case setData.NO_DESCRIPTION:
                return res.json(400, {error: "A description is required"});
            case setData.NO_START_DATE:
                return res.json(400, {error: "A start data is required"});
            case setData.NO_END_DATE:
                return res.json(400, {error: "An end data is required"});
            default:
                console.log("Error while creating set:", err);
                return res.json(500, {error: "Unknown error while creating set"});
            }
        }

        // A hack to use allow us to use the single route handler
        req.params.id = newId;
        // return the new data
        exports.singleWithStatus(req, res, 201);
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
    // Check for user login
    if (!req.user) return res.json(401, {error: "Need to be logged in to make this request"});

    setData.updateById(req, req.params.id, req.body.name, req.body.start_date, req.body.end_date, function(err, result) {
        if (err) {
            switch (err) {
            case setData.NO_ID:
                return res.json(400, {error: "An id is required"});
            case setData.SET_NOT_FOUND:
                return res.json(404, {error: "Set with that id not found"});
            default:
                console.log("Error while updating set:", err);
                return res.json(500, {error: "Unknown error while updating set"});
            }
        }

        // return the new data
        exports.single(req, res);
    });
};

/*
 * DELETE a set
 * Params:
 *   id - The id of the set (required)
 * TODO: Only allow the owning user to do this
 */
exports.del = function(req, res) {
    // Check for user login
    if (!req.user) return res.json(401, {error: "Need to be logged in to make this request"});
    
    setData.deleteById(req, req.params.id, function(err, result) {
        if (err) {
            switch (err) {
            case setData.NO_ID:
                return res.json(400, {error: "An id is required"});
            case setData.SET_NOT_FOUND:
                return res.json(404, {error: "Set with that id not found"});
            default:
                console.log("Error while deleting set:", err);
                return res.json(500, {error: "Unknown error while deleting set"});
            }
        }

        res.json(200, {message: "Delete complete"});
    });
};
