var sqlUtils = require('../utils/sql'),
    assert = require('assert');

module.exports = {
    'Empty sql null check': function() {
        var test = null;
        var result = sqlUtils.wrapQuotesOrNull(test);
        assert.equal(result, "NULL");
    },
    'Empty sql empty check': function() {
        var test = '';
        var result = sqlUtils.wrapQuotesOrNull(test);
        assert.equal(result, "NULL");
    },
    'Empty sql value check': function() {
        var test = "Test";
        var result = sqlUtils.wrapQuotesOrNull(test);
        assert.equal(result, "'Test'");
    }
};
