var express = require('express');
var settings = require('./settings');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var path = require('path');
var routes = require('./routes/index');
var cookieParser = require('cookie-parser');
var app = express();

app.use(session({
    secret: settings.cookieSecret,
    key: settings.db, //cookie name
    cookie: { maxAge: 1000 * 60 * 60 *24 * 30 }, //cookie 过期时间30 days
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        /*db: settings.db,
        host: settings.host,
        port: settings.port*/ // connect-mongo0.8.2以后的版本不再使用这个连接策咯，使用只想mongoDB的url
        url: 'mongodb://localhost/my-project-server' //url:‘mongodb://localhost/’ + settings.db,
    })
}));
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app);
app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;