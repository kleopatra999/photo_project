var app = require('../app'),
    assert = require('assert');

app.on('dbCreated', function() {
    exports['Test photo list error no set_id'] = function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app.server,
            {
                url: '/photo'
            },
            {
                status: 400,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
        );
    };
    exports['Test photo list content type'] = function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app.server,
            {
                url: '/photo?set_id=1'
            },
            {
                status: 200,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
        );
    };
    exports['Test single photo content type'] = function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app.server,
            {
                url: '/photo/1'
            },
            {
                status: 200,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
        );
    };
    exports['Create single photo'] = function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app.server,
            {
                url: '/photo?set_id=1',
                method: 'POST'
            },
            {
                status: 201,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
        );
    };
});