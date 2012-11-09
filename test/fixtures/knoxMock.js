var _ = require('underscore');

// Setup this module to emit events
var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();

// Stores the files we've seen so far
var files = [];

// Creates the client and returns and request object
module.exports.createClient = function() {
    return client;
};

// 
module.exports.testRoute = function(req, res) {
    var path = '/' + req.params.path;
    if (_.indexOf(files, path) != -1) {
        res.sendfile('test/fixtures/uok.jpg');
    }
    else {
        res.send(404);
    }
};

// The client methods
var client = {
    // Adds a new file
    put: function(path) {
        files.push(path);
        req.url = '/fileTest' + path;
        return req;
    },
    // Lists all the current files
    list: function(callback) {
        callback(null, {
            Contents: files
        });
    },
    // Deletes all the files
    deleteMultiple: function(list, callback) {
        files = _.without(files, list);
        callback();
    }
};

// The request interface emits events
var req = new EventEmitter();
// The end method should wait a little while and then emit a response with a status code
req.end = function() {
    setTimeout(function() {
        req.emit('response', {statusCode: 200});
    }, 100);
};
