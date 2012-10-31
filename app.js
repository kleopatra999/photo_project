// Load in all our dependancies
var express = require('express'),
    photo = require('./routes/photo'),
    set = require('./routes/set'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    database = require('./utils/database');

// Get the instance of express
var app = express();

// Configure for all environments
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

// Configure if we're in development
app.configure('development', function(){
    app.use(express.errorHandler());
});

// Setup the routes
app.get('/photo', photo.list);
app.get('/photo/:id', photo.single);
app.get('/set', set.list);
app.get('/set/:id', set.single);
app.get('/user', user.list);

// Start the server
// This also doubles as the export which is used for the test framework
var server = module.exports.server = http.createServer(app);
// Only start listening if we aren't being tested
if (!module.parent) {
    server.listen(app.get('port'), function(){
        console.log("Express server started at http://0.0.0.0:" + app.get('port'));
    });
}

// Setup the database config
if (module.parent) {
    // Setup the database
    database.setup({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'photo_project_test',
        multipleStatements: true
    });
    // Also setup the database
    database.createDB();

    // Listen for close events and shut down the database
    server.on('close', function() {
        database.deleteDB();
        database.tearDown();
    });
}
else {
    // Setup the database
    database.setup({
        host: 'localhost',
        user: 'root',
        password: '1990',
        database: 'photo_project'
    });
    // Listen for close events and shut down the database
    server.on('close', function() {
        database.tearDown();
    });
}
