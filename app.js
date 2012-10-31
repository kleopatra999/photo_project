
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    photo = require('./routes/photo'),
    set = require('./routes/set'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/photo', photo.list);
app.get('/photo/:id', photo.single);
app.get('/set', set.list);
app.get('/set/:id', set.single);
app.get('/user', user.list);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server started at http://0.0.0.0:" + app.get('port'));
});
