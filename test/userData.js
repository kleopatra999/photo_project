var assert = require('assert'),
    userData = require('../data/user');

describe('User data', function() {
    describe('getByEmail', function() {
        it('should fail on incorrect email', function() {
            userData.getByEmail('user@doesnt.exist', function(err, user) {
                assert.equal(user, null);
            });
        });

        it('should return a user when given a correct email', function() {
            userData.getByEmail('default@user.me', function(err, user) {
                assert.notEqual(user, null);
            });
        });
    });

    describe('getById', function() {
        it('should fail on incorrect id', function() {
            userData.getById('123', function(err, user) {
                assert.equal(user, null);
            });
        });

        it('should return a user when given a correct id', function() {
            userData.getById('1', function(err, user) {
                assert.notEqual(user, null);
            });
        });
    });
});
