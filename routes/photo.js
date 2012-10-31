
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
    // TODO: Make this check to see if we have a valid set id
    if (false) {
        res.json(404, {error: "set_id not found"});
        return;
    }

    // TODO: Make this return the actual data
    var response = {
        set_id: req.query.set_id,
        photos: []
    };

    res.json(response);
};

/*
 * GET a single photo
 * Params:
 *   id - the photo id
 * TODO: Should only return a set if user has access to it
 */
exports.single = function(req, res) {
    // TODO: Make this return the actual data
    var response = {
        id: req.params.id
    };

    res.json(response);
};

