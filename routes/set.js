
/*
 * GET all sets
 * TODO: Should only return sets user has access to
 */
exports.list = function(req, res) {
    // TODO: Make this return the actual data
    var response = [];

    res.json(response);
};

/*
 * GET a single set
 * Params:
 *   id - the set id
 * TODO: Should only return a set if user has access to it
 */
exports.single = function(req, res) {
    // TODO: Make this return the actual data
    var response = {
        id: req.params.id
    };

    res.json(response);
};

