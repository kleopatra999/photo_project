var app = require('../app'),
    assert = require('assert');

app.on('dbCreated', function() {
    exports['Test index content type'] = function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app.server,
            {
                url: '/'
            },
            {
                status: 200,
                headers: {'Content-Type': 'text/html; charset=UTF-8'}
            }
        );
    };
});