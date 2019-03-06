var settings = require('../settings'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server;
var mongodb = new Db(settings.db, new Server(settings.host, settings.port), {safe: true});

module.exports = new Promise(function (resolve, reject) {
    mongodb.open((err, db) => {
        if (err) {
            reject(err);
        }
        resolve(db);
    });
});
