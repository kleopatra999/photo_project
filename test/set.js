var app = require('../app'),
    assert = require('assert');

module.exports = {
    'Test set list content type': function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app,
            {
                url: '/set'
            },
            {
                status: 200,
                headers: {'Content-Type': 'application/json; charset=utf-8'},
                body: "[]"
            }
        );
    },
    'Test single set content type': function(beforeExit, assert) {
        this.callback = function(){};
        assert.response(app,
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