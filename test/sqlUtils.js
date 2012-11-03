var sqlUtils = require('../utils/sql'),
    assert = require('assert');

describe('SqlUtils', function() {
    describe('Wrap quote or NULL', function() {
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

    describe.only('Create value list', function() {
        it('should return null when nothing passed in', function() {
            var result = sqlUtils.createValueList(null);
            assert.equal(result, null);
        });

        it('should return null when no tests are not null', function() {
            var result = sqlUtils.createValueList([
                {name: '1', test: null, value: '1'},
                {name: '2', test: null, value: '2'},
                {name: '3', test: null, value: '3'}
            ]);
            assert.equal(result, null);
        });

        it('should only return values with tests which are not null', function() {
            var result = sqlUtils.createValueList([
                {name: '1', test: '1', value: '\'1\''},
                {name: '2', test: null, value: '\'2\''},
                {name: '3', test: null, value: '\'3\''}
            ]);
            assert.equal(result, '`1` = \'1\'');
        });
    });
});
