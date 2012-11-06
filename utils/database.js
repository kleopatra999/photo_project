var mysql = require('mysql'),
    fs = require('fs'),
    app = require('../app');

var databaseConfig;

// Set the database connection parameters
if (app.testing) {
    // For testing
    databaseConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'photo_project_test',
        multipleStatements: true
    };
}
else {
    // For production
    databaseConfig = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'photo_project'
    };
}

// Sets up the database connection and keeps it open
var connect = function() {
    // Connect to the MySql server
    var connection = mysql.createConnection(databaseConfig);
    connection.connect();
    return connection;
};

// Creates the database structure from the sql file
var createDB = function(callback) {
    // Delete the database incase the tables exist
    module.exports.deleteDB(function() {
        // Load in the database sql file
        var sql = fs.readFileSync( __dirname + '/../config/database.sql').toString();
        var db = module.exports.connect();
        db.query(sql, function(err, rows, fields) {
            if (err) throw err;
            db.end();
            callback();
        });
    });
};

var deleteDB = function(callback) {
    var db = module.exports.connect();
    db.query("DROP TABLE `photo`, `set_user`, `user`, `set`;", function(err, rows, fields) {
        db.end();
        if (callback) callback();
    });
};

var middleware = function() {
    return function(req, res, next) {
        req.dbConnection = module.exports.connect();

        res.on('finish', function() {
            req.dbConnection.end();
        });

        next();
    };
};

// The external interface of this module
module.exports = {
    'connect': connect,
    'createDB': createDB,
    'deleteDB': deleteDB,
    'middleware': middleware
};
