var crypto = require('crypto'),
    url = require('url'),
    Func = require('../models/func.js'),
    Response = require('../utils/Response.js');

module.exports = function(app) {
    app.get('/', function(req, res) {
        console.log(123);
        var data = {key: 'value', hello: 'world'};
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.send(JSON.stringify(data));
        res.end();
    });

    app.post('/save/func', checkNotLogin);
    app.post('/save/func', function(req, res) {
        console.log(req.body);
        var func = new Func(req.body);
        func.save(function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '保存成功');
            res.end();
        });
    });

    app.get('/get/func/list', checkNotLogin);
    app.get('/get/func/list', function(req, res) {
        var reqParams = url.parse(req.url, true).query;
        Func.get(reqParams, function(err, result) {
            if (err) {
                console.log(err);
                res.end(err);
            }
            res.end(JSON.stringify(new Response(200, null, result.dataList, result.totalRow, reqParams.pageSize, reqParams.currentPage)));
        });
    });

    app.get('/get/func/tree/list', checkNotLogin);
    app.get('/get/func/tree/list', function(req, res) {
        Func.getAll(null, function(err, result) {
            if (err) {
                console.log(err);
                res.end(err);
            }
            res.end(JSON.stringify(new Response(200, null, result.dataList)));
        });
    });

    app.post('/delete/func/by/uuid', checkNotLogin);
    app.post('/delete/func/by/uuid', function(req, res) {
        console.log(req.body);
        if (req.body.uuid) {
            var func = new Func(req.body);
            console.log(func);
            func.deleteFuncByUuid(function(err) {
                if (err) {
                    res.end(err);
                }
                res.end(JSON.stringify(new Response(200, null, null)));
            });
        } else {
            res.end(JSON.stringify(new Response(500, 'uuid为空!', null)));
        }
    });

    app.post('/login', checkNotLogin);
    app.post('/login', function(req, res) {
    });

    app.get('/post', checkLogin);
    app.get('/post', function(req, res) {
    });

    app.post('/post', checkLogin);
    app.post('/post', function(req, res) {
    });

    app.get('/logout', checkLogin);
    app.get('/logout', function(req, res) {
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