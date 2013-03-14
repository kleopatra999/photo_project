var fs = require('fs'),
    im = require('imagemagick'),
    knox = require('knox'),
    app = require('../app'),
    urls = require('./urls');

var sizeNames = ["small", "medium", "large"];
var sizeNumbers = [100, 300, 800];

var client = knox.createClient({
    key: 'AKIAJC56DUVJJKN7JVYA',
    secret: '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',
    bucket: 'photoproject',
    region: 'eu-west-1'
});

var uploadPhoto = function(req, path, callback) {
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
    copyFile(path, getFilePath(prefix + 'orig.jpg'), function(err) {
        out_files['orig'] = getPublicFilePath(req, prefix + 'orig.jpg');

        // Make the thumbnails and upload to S3
        for (var i = 0; i < sizeNumbers.length; i++) {
            uploadThumbnail(req, path, prefix, sizeNumbers[i], sizeNames[i], function(err, sizeName, file) {
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

function uploadThumbnail(req, inFile, prefix, sizeNumber, sizeName, callback) {
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
        callback(null, sizeName, getPublicFilePath(req, filename));
    });
}

function copyFile(source, target, callback) {
    console.log(source);
    console.log(target);
    var callbackCalled = false;

    var readStream = fs.createReadStream(source);
    readStream.on("error", function(err) {
        done(err);
    });
    var writeStream = fs.createWriteStream(target);
    writeStream.on("error", function(err) {
        done(err);
    });
    writeStream.on("close", function(ex) {
        done();
    });
    readStream.pipe(writeStream);

    function done(err) {
        if (!callbackCalled) {
            callback(err);
            callbackCalled = true;
        }
    }
}

function getFilePath(filename) {
    return './public/img/photos/' + filename;
}

function getPublicFilePath(req, filename) {
    return urls.getBaseServerUrl(req) + 'img/photos/' + filename;
}

function genRandonNumber() {
    return Math.floor(Math.random() * 90000) + 10000;
}
