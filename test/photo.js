var app = require('../app'),
    assert = require('assert');

module.exports = {
    'Test photo list error no set_id': function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app,
            {
                url: '/photo'
            },
            {
                status: 400,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
        );
    },
    'Test photo list content type': function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app,
            {
                url: '/photo?set_id=1'
            },
            {
                status: 200,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
        );
    },
    'Test single photo content type': function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app,
            {
                url: '/photo/1'
            },
            {
                status: 200,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            },
            function (res) {
                assert.eql(JSON.parse(res.body), {id: 1});
            }
        );
    }
};