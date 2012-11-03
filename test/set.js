var app = require('../app'),
    assert = require('assert'),
    request = require('supertest');

describe('Set', function() {
    describe('List', function() {
        it('should return json content type', function(done) {
            request(app.server)
                .get('/set')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });
    });
    describe('Single', function() {
        it('should return json content type', function(done) {
            request(app.server)
                .get('/set/1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return 404 for incorrect id', function(done) {
            request(app.server)
                .get('/set/1000')
                .expect(404)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return 200 for correct id', function(done) {
            request(app.server)
                .get('/set/1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return 201 after creating a set', function(done) {
            request(app.server)
                .post('/set/?name=Testing')
                .expect(201)
                .expect('Content-Type', /json/)
                .end(done);
        });
    });
});
