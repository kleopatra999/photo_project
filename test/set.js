var app = require('../app'),
    assert = require('assert');

module.exports = {
    'Test set list content type': function(beforeExit, assert) {
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
    },
    'Test single set content type': function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app.server,
            {
                url: '/set/1'
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