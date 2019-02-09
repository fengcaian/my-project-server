var crypto = require('crypto');

module.exports = function(app) {
    app.get('/', function (req, res) {
        console.log(123);
        var data = {key: 'value', hello: 'world'};
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(data));
    });

    app.get('/reg', checkNotLogin);
    app.get('/reg', function (req, res) {

    });

    app.post('/reg', checkNotLogin);
    app.post('/reg', function (req, res) {
        req.flash('error', '两次输入的密码不一致!');
    });

    app.get('/login', checkNotLogin);
    app.get('/login', function (req, res) {
    });

    app.post('/login', checkNotLogin);
    app.post('/login', function (req, res) {
    });

    app.get('/post', checkLogin);
    app.get('/post', function (req, res) {
    });

    app.post('/post', checkLogin);
    app.post('/post', function (req, res) {
    });

    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');
        }
        next();
    }
};