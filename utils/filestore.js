var fs = require('fs'),
    app = require('../app');

var client = null;

app.on('setupComplete', function() {
    var knox;
    if (app.testing) {
        knox = require('../test/fixtures/knoxMock');
    }
    else {
        knox = require('knox');
    }

    client = knox.createClient({
        key: 'AKIAJC56DUVJJKN7JVYA',
        secret: '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',
        bucket: 'photoproject',
        region: 'eu-west-1'
    });
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
        var req = client.put('/photos-' + date + '-' + genRandonNumber() + '.jpg', {
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
    client.list(function(err, data) {
        if (err) throw err;

        // Check if we have an files
        if (data.Contents) {
            // Get an array of all the files
            var files = [];
            for (var i = 0; i < data.Contents.length; i++) {
                files.push(data.Contents[i].Key);
            }

            // Delete all the files and make the callback
            client.deleteMultiple(files, done);
        }
        else {
            // If not we're done here!
            done();
        }
    });
};

module.exports = {
    'uploadPhoto': uploadPhoto,
    'deleteAllFiles': deleteAllFiles
};

function genRandonNumber() {
    return Math.floor(Math.random() * 90000) + 10000;
}
