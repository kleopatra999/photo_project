var fs = require('fs');

// Removed all files from the photos data store
exports.deleteAllFiles = function(done) {
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
