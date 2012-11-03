var app = require('../app'),
    request = require('supertest');

describe('Index', function() {
    it('index content type', function(done) {
        request(app.server)
            .get('/')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=UTF-8')
            .end(done);
    });
});
