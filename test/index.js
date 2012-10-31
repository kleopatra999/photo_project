var app = require('../app'),
    assert = require('assert');

module.exports = {
    'Test index content type': function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app,
            {
                url: '/'
            },
            {
                status: 200,
                headers: {'Content-Type': 'text/html; charset=utf-8'}
            }
        );
    }
};