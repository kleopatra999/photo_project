var app = require('../app'),
    assert = require('assert'),
    database = require('../utils/database');

app.on('dbCreated', function() {
    exports['Test set list content type'] = function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app.server,
            {
                url: '/set'
            },
            {
                status: 200,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
        );
    };
    exports['Test single set content type'] = function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app.server,
            {
                url: '/set/1'
            },
            {
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
        );
    };
    exports['Test single set 404'] = function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app.server,
            {
                url: '/set/1000'
            },
            {
                status: 404,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
        );
    };
    exports['Single set 200'] = function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app.server,
            {
                url: '/set/1'
            },
            {
                status: 200,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
        );
    };
});
