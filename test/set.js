var app = require('../app'),
    assert = require('assert');

exports['GET /set'] = function() {
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
};