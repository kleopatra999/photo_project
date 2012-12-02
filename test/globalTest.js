var app = require('../app'),
    database = require('../utils/database'),
    filestore = require('../utils/filestore');

beforeEach(function(done) {
    database.createDB(done);
});
