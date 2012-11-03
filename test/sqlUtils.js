var sqlUtils = require('../utils/sql'),
    assert = require('assert');

describe('SqlUtils', function() {
    it('should return null for null variable', function() {
        var test = null;
        var result = sqlUtils.wrapQuotesOrNull(test);
        assert.equal(result, "NULL");
    });

    it('should return null for empty string', function() {
        var test = '';
        var result = sqlUtils.wrapQuotesOrNull(test);
        assert.equal(result, "NULL");
    });

    it('should return the string wrapped in quotes for a non empty string', function() {
        var test = 'Test';
        var result = sqlUtils.wrapQuotesOrNull(test);
        assert.equal(result, "'Test'");
    });
});
