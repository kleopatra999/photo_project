var fs = require('fs'),
    im = require('imagemagick'),
    knox = require('knox'),
    app = require('../app');

var sizeNames = ["small", "medium", "large"];
var sizeNumbers = [100, 300, 800];

var client = knox.createClient({
    key: 'AKIAJC56DUVJJKN7JVYA',
    secret: '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',
    bucket: 'photoproject',
    region: 'eu-west-1'
});

var uploadPhoto = function(path, callback) {
    // If we're testing then basically do nothing
    if (app.testing) {
        callback(null, {
            'orig': 'http://nothing.com/blah.jpg',
            'small': 'http://nothing.com/blah.jpg',
            'medium': 'http://nothing.com/blah.jpg',
            'large': 'http://nothing.com/blah.jpg'
        });
        return;
    }

    var date = Date.now();
    var prefix = 'photos-' + date + '-' + genRandonNumber() + '-';
    var out_files = [];
    var filesReturned = 0;

    // Push the origional file to S3
    fs.readFile(path, function(err, buffer) {
        pushToS3(prefix + 'orig.jpg', buffer, function(err, file) {
            out_files['orig'] = file;

            // Make the thumbnails and upload to S3
            for (var i = 0; i < sizeNumbers.length; i++) {
                uploadThumbnail(path, prefix, sizeNumbers[i], sizeNames[i], function(err, sizeName, file) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    out_files[sizeName] = file;
                    filesReturned++;

                    // Check if all thumbnails are uploaded
                    if (filesReturned == sizeNumbers.length) {
                        // Make the callback
                        callback(null, out_files);
                    }
                });
            }
        });
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

function uploadThumbnail(inFile, prefix, sizeNumber, sizeName, callback) {
    var filename = prefix + sizeName + ".jpg";

    im.resize({
        srcPath: inFile,
        dstPath: getFilePath(filename),
        width: sizeNumber
    }, function(err, stdout, stderr){
        if (err) {
            callback(err);
            return;
        }

        fs.readFile(getFilePath(filename), function(err, buffer) {
            // If we have an error then go no further
            if (err) {
                callback(err);
                return;
            }

            pushToS3(filename, buffer, function(err, file) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, sizeName, file);
            });
        });
    });
}

function pushToS3(filename, buffer, callback) {
    // Make an amazon S3 request
    var req = client.put('/' + filename, {
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
}

function getFilePath(filename) {
    return '/tmp/' + filename;
}

function genRandonNumber() {
    return Math.floor(Math.random() * 90000) + 10000;
}
