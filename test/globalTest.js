var app = require('../app'),
    database = require('../utils/database');

beforeEach(function(done) {
    database.createDB(done);
});
