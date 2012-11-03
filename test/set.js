var app = require('../app'),
    request = require('supertest'),
    assert = require('assert');

describe('Set', function() {
    describe('List', function() {
        it('should return json content type', function(done) {
            request(app.server)
                .get('/set')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return a single set', function(done) {
            request(app.server)
                .get('/set')
                .end(function(err, res) {
                    if (err) throw err;
                    assert.equal(res.body.length, 1);
                    done();
                });
        });
    });
    describe('Single', function() {
        it('should return 200 and json content type', function(done) {
            request(app.server)
                .get('/set/1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return the correct set', function(done) {
            request(app.server)
                .get('/set/1')
                .end(function(err, res) {
                    if (err) throw err;
                    assert.equal(res.body.id, '1');
                    done();
                });
        });

        it('should return 404 and json message for incorrect id', function(done) {
            request(app.server)
                .get('/set/1000')
                .expect(404)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return 200 and json message for correct id', function(done) {
            request(app.server)
                .get('/set/1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });
    });

    describe('Creating', function() {
        it('should return 201 and json message after creating', function(done) {
            request(app.server)
                .post('/set/?name=Testing')
                .expect(201)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should be get 200 and json data after creating', function(done) {
            request(app.server)
                .post('/set/?name=Testing')
                .end(function(err, res) {
                    if (err) throw err;
                    var newId = res.body.id;
                    request(app.server)
                        .get('/set/' + newId)
                        .expect(200)
                        .expect('Content-Type', /json/)
                        .end(done);
                });
        });

        it('should be get the correct set after creating', function(done) {
            request(app.server)
                .post('/set/?name=Testing')
                .end(function(err, res) {
                    if (err) throw err;
                    var newId = res.body.id;
                    request(app.server)
                        .get('/set/' + newId)
                        .end(function(err, res) {
                            if (err) throw err;
                            assert.equal(res.body.id, newId);
                            assert.equal(res.body.name, 'Testing');
                            done();
                        });
                });
        });
    });

    describe('Deleting', function() {
        it('should get 200 and json message after deleting', function(done) {
            request(app.server)
                .del('/set/1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should get 404 and json message after deleting', function(done) {
            request(app.server)
                .del('/set/1')
                .end(function(err, res) {
                    if (err) throw err;
                    request(app.server)
                        .get('/set/1')
                        .expect(404)
                        .expect('Content-Type', /json/)
                        .end(done);
                });
        });
    });

    describe('Updating', function() {
        it('should return 200 and json message after updating', function(done) {
            request(app.server)
                .post('/set/1/?name=Changed')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should have a new name after updating', function(done) {
            request(app.server)
                .post('/set/1/?name=Changed')
                .end(function(err, res) {
                    if (err) throw err;
                    request(app.server)
                        .get('/set/1')
                        .end(function(err, res) {
                            if (err) throw err;
                            assert.equal(res.body.name, 'Changed');
                            done();
                        });
                });
        });

        it('should not change the name if one is not passed', function(done) {
            request(app.server)
                .post('/set/1')
                .end(function(err, res) {
                    if (err) throw err;
                    request(app.server)
                        .get('/set/1')
                        .expect(200)
                        .end(function(err, res) {
                            if (err) throw err;
                            assert.equal(res.body.name, 'Testing');
                            done();
                        });
                });
        });
    });
});
