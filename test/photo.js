var app = require('../app'),
    database = require('../utils/database'),
    request = require('supertest');

describe('Photo', function() {
    beforeEach(function(done) {
        database.createDB(done);
    });

    describe('list', function() {
        it('should error with no set_id', function(done) {
            request(app.server)
                .get('/photo')
                .expect(400)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return json content type', function(done) {
            request(app.server)
                .get('/photo?set_id=1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });
    });
    describe('single', function() {
        it('should return json content type', function(done) {
            request(app.server)
                .get('/photo/1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return 201 after creating photo', function(done) {
            request(app.server)
                .post('/photo/?set_id=1')
                .expect(201)
                .expect('Content-Type', /json/)
                .end(done);
        });
    });
});
