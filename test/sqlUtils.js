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

    describe('Create value list', function() {
        it('should return null when nothing passed in', function() {
            var result = sqlUtils.createValueList(null);
            assert.equal(result, null);
        });

        it('should return null when no values are not null', function() {
            var result = sqlUtils.createValueList([
                {name: '1', value: null},
                {name: '2', value: null},
                {name: '3', value: null}
            ]);
            assert.equal(result, null);
        });

        it('should only return values with values which are not null', function() {
            var result = sqlUtils.createValueList([
                {name: '1', value: '1'},
                {name: '2', value: null},
                {name: '3', value: null}
            ]);
            assert.equal(result, "`1` = '1'");
        });

        it('should only return a comma seperated list if more than one value isnt null', function() {
            var result = sqlUtils.createValueList([
                {name: '1', value: '1'},
                {name: '2', value: '2'},
                {name: '3', value: '3'}
            ]);
            assert.equal(result, "`1` = '1', `2` = '2', `3` = '3'");
        });
    });
});
