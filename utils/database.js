var mysql = require('mysql'),
    fs = require('fs');

// Sets up the database connection and keeps it open
var setup = function(config) {
    // Connect to the MySql server
    module.exports.connection = mysql.createConnection(config);
    module.exports.connection.connect();
};

// Creates the database structure from the sql file
var createDB = function() {
    // Load in the database sql file
    var sql = fs.readFileSync( __dirname + '/../config/database.sql').toString();
    module.exports.connection.query(sql, function(err, rows, fields) {
        if (err) throw err;

        console.log('Database creation complete');
    });
};

var deleteDB = function() {
    module.exports.connection.query("DROP TABLE `photo`, `set_user`, `user`, `set`;", function(err, rows, fields) {
        console.log("Database deletion complete");
    });
};

// Closes the database connection
var tearDown = function() {
    module.exports.connection.end();
};

// The external interface of this module
module.exports = {
    connection: null,
    'setup': setup,
    'createDB': createDB,
    'deleteDB': deleteDB,
    'tearDown': tearDown
};
