var app = require('../app'),
    request = require('supertest'),
    assert = require('assert');

describe('Photo', function() {
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

        it('should return 404 with json message for invalid set_id', function(done) {
            request(app.server)
                .get('/photo?set_id=1000')
                .expect(404)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return the correct set information', function(done) {
            request(app.server)
                .get('/photo?set_id=1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) throw err;
                    assert.equal(res.body[0].set_id, '1');
                    done();
                });
        });
    });

    describe('single', function() {
        it('should return json content type', function(done) {
            request(app.server)
                .get('/photo/1')
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return 200 for valid id', function(done) {
            request(app.server)
                .get('/photo/1')
                .expect(200)
                .end(done);
        });

        it('should return 404 with json message for incorrect id', function(done) {
            request(app.server)
                .get('/photo/1000')
                .expect(404)
                .expect('Content-Type', /json/)
                .end(done);
        });
    });

    describe('Creating', function() {
        it('should return 400 if no set_id is sent', function(done) {
            request(app.server)
                .post('/photo/')
                .expect(400)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return 404 if the set_id provided does not exist', function(done) {
            request(app.server)
                .post('/photo/?set_id=1000')
                .attach('photo', 'test/fixtures/uok.jpg')
                .expect(404)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return 400 if no photo file provided', function(done) {
            request(app.server)
                .post('/photo/?set_id=1')
                .expect(400)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return 201 after creating', function(done) {
            request(app.server)
                .post('/photo/?set_id=1')
                .attach('photo', 'test/fixtures/uok.jpg')
                .expect(201)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should be able to access a photo after creating', function(done) {
            request(app.server)
                .post('/photo/?set_id=1')
                .attach('photo', 'test/fixtures/uok.jpg')
                .end(function(err, res) {
                    if (err) throw err;
                    var newId = res.body.id;
                    request(app.server)
                        .get('/photo/' + newId)
                        .expect(200)
                        .end(done);
                });
        });
    });

    describe('Deleting', function() {
        it('should return 200 and json message after deleting', function(done) {
            request(app.server)
                .del('/photo/1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should not be able to access a photo after deleting', function(done) {
            request(app.server)
                .del('/photo/1')
                .end(function(err, res) {
                    if (err) throw err;
                    request(app.server)
                        .get('/photo/1')
                        .expect(404)
                        .end(done);
                });
        });
    });

    describe('Updating', function() {
        it('should return 200 and json message after updating', function(done) {
            request(app.server)
                .post('/photo/1/')
                .send({description: "Changed"})
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should have a new title after updating', function(done) {
            request(app.server)
                .post('/photo/1/')
                .send({description: "Changed"})
                .end(function(err, res) {
                    if (err) throw err;
                    request(app.server)
                        .get('/photo/1')
                        .expect(200)
                        .end(function(err, res) {
                            if (err) throw err;
                            assert.equal(res.body.description, 'Changed');
                            done();
                        });
                });
        });

        it('should not change the description if one is not passed', function(done) {
            request(app.server)
                .post('/photo/1')
                .end(function(err, res) {
                    if (err) throw err;
                    request(app.server)
                        .get('/photo/1')
                        .expect(200)
                        .end(function(err, res) {
                            if (err) throw err;
                            assert.equal(res.body.description, 'A simple test');
                            done();
                        });
                });
        });
    });
});
