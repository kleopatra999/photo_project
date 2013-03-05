var app = require('../app'),
    request = require('supertest'),
    assert = require('assert');

describe('User', function() {
    describe('Register', function() {
        it('Should error when no email is provided', function(done) {
            request(app.server)
                .post('/user/register')
                .send({password: "password"})
                .expect(500)
                .end(done);
        });

        it('Should error when no password is provided', function(done) {
            request(app.server)
                .post('/user/register')
                .send({email: "oakesm9@googlemail.com"})
                .expect(500)
                .end(done);
        });

        it('Should error when no nothing is provided', function(done) {
            request(app.server)
                .post('/user/register')
                .send({email: "oakesm9@googlemail.com"})
                .expect(500)
                .end(done);
        });

        it('Should register when email and password provided', function(done) {
            request(app.server)
                .post('/user/register')
                .send({email: "oakesm9@googlemail.com", password: "password123"})
                .expect(200)
                .end(done);
        });

        it('Should register when email, password and name provided', function(done) {
            request(app.server)
                .post('/user/register')
                .send({email: "another@googlemail.com", password: "password123", name: "User Name"})
                .expect(200)
                .end(done);
        });
    });
});
