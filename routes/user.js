var userData = require('../data/user');

/*
 * GET users listing.
 */

exports.list = function(req, res){
    res.send("respond with a resource");
};

exports.register = function(req, res) {
    userData.create(req.body.email, req.body.password, req.body.name, function(err, newId) {
        if (err) {
            return res.json(500, {error: 'Cannot create user'});
        }

        userData.getById(newId, function(err, user) {
            if (err) {
                return res.json(500, {error: 'Cannot create user'});
            }

            req.login(user, function(err) {
                if (err) {
                    return res.json(500, {error: 'Cannot create user'});
                }

                return res.json(200, {'newId': newId});
            });
        });
    });
};