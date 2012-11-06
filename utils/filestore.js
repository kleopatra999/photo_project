var fs = require('fs'),
    knox = require('knox'),
    app = require('../app');

var bucket = (app.testing) ? 'photoprojecttest' : 'photoproject';

var client = knox.createClient({
    key: 'AKIAJC56DUVJJKN7JVYA',
    secret: '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',
    bucket: bucket,
    region: 'eu-west-1'
});

var uploadPhoto = function(path, callback) {
    fs.readFile(path, function(err, buffer) {
        // If we have an error then go no further
        if (err) {
            callback(err);
            return;
        }

        // Make an amazon S3 request
        var date = Date.now();
        var req = client.put('/photos/' + date + '-' + genRandonNumber() + '.jpg', {
            'Content-Length': buffer.length,
            'Content-Type': 'image/jpeg',
            'x-amz-acl': 'public-read'
        });

        // When the S3 request responds
        req.on('response', function(res) {
            if (200 == res.statusCode) {
                callback(null, req.url);
            }
            else {
                callback('Error', null);
            }
        });

        // Send the data!
        req.end(buffer);
    });
};

// Removed all files from the photos data store
var deleteAllFiles = function(done) {
    fs.readdir('./photos', function(err, files) {
        if (err) throw err;

        for (var i = 0; i < files.length; i++) {
            fs.unlinkSync('./photos/' + files[i]);
        }

        fs.rmdir('./photos', function(err) {
            if (err) throw err;
            fs.mkdir('./photos', done);
        });
    });
};

module.exports = {
    'uploadPhoto': uploadPhoto,
    'deleteAllFiles': deleteAllFiles
};

function genRandonNumber() {
    return Math.floor(Math.random() * 90000) + 10000;
}
