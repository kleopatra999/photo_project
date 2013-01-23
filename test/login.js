var assert = require('assert'),
    loginUtil = require('../utils/login');

describe('Login', function() {
    it('should fail on incorrect email', function() {
        loginUtil._getAndCheckUser('user@doesnt.exist', 'nothing', function(err, user, info) {
            assert.equal(user, false);
        });
    });

    it('should fail on incorrect password', function() {
        loginUtil._getAndCheckUser('default@user.me', 'incorrect', function(err, user, info) {
            assert.equal(user, false);
        });
    });

    it('should return a user when details are correct', function() {
        loginUtil._getAndCheckUser('default@user.me', 'default', function(err, user, info) {
            assert.notEqual(user, false);
        });
    });
});
