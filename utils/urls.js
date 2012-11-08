exports.getSetListUrl = function(req) {
    return exports.getBaseServerUrl(req) + 'set';
};

exports.getSetUrl = function(req, id) {
    return exports.getBaseServerUrl(req) + 'set/' + id;
};

exports.getPhotoListUrl = function(req, setId) {
    return exports.getBaseServerUrl(req) + 'photo/?set_id=' + setId;
};

exports.getPhotoUrl = function(req, id) {
    return exports.getBaseServerUrl(req) + 'photo/' + id;
};

exports.getBaseServerUrl = function(req) {
    return 'http://' + req.header('host') + '/';
};
