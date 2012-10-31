var mysql = require('mysql'),
    fs = require('fs');

// Sets up the database connection and keeps it open
var setup = function(multipleStatements) {
    if (!multipleStatements) {
        multipleStatements = false;
    }

    // Connect to the MySql server
    module.exports.connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1990',
        database: 'photo_project',
        multipleStatements: multipleStatements
    });
    module.exports.connection.connect();
};

// Creates the database structure from the sql file
var createDB = function() {
    // Load in the database sql file
    fs.readFile( __dirname + '/../config/database.sql', function (err, data) {
        if (err) {
            throw err;
        }

        var sql = data.toString();
        console.log(sql);

        module.exports.connection.query(sql, function(err, rows, fields) {
            if (err) throw err;

            console.log('Database creation complete');
        });
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
    'tearDown': tearDown
};
