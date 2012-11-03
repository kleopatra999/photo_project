var app = require('../app'),
    request = require('supertest'),
    assert = require('assert');

describe('Index', function() {
    it('index content type', function(done) {
        app.on('dbCreated', function() {
            request(app.server)
                .get('/')
                .expect(200)
                .expect('Content-Type', 'text/html; charset=UTF-8')
                .end(done);
        });
    });
});
