var mongodb = require('./db');

function Func(func) {
    this.name = func.funcName;
    this.key = func.funcKey;
    this.urlList = func.urlList;
    this.desc = func.funcDesc;
}

module.exports = Func;
 // 存储一篇文章及其信息
Func.prototype.save = function (callback) {
    var date = new Date();
    var timestamp = Date.parse(date);
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };

    var func = { // 要存储的文档
        id: 'func_id_' + timestamp,
        name: this.name,
        key: this.key,
        urlList: this.urlList,
        desc: this.desc,
        time: time
    };

    // 打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取post集合
        db.collection('funcs', function (err, collection) {
            if (err) {
                mongodb.clone();
                return callback(err);
            }
            // 将文档插入post集合
            collection.insert(func, {
                safe: true
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            })
        })
  })
};

Func.get = function (params, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取funcs集合
        db.collection('funcs', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (params.keyWord) {
                query.$or = [
                    {
                        name: params.keyWord
                    },
                    {
                        key: params.keyWord
                    },
                    {
                        desc: params.keyWord
                    }
                ];
            }
            // 根据query对象查询文章
            collection.find(query)
                .sort({
                    time: -1
                })
                .skip(Number(params.pageSize) * Number(params.currentPage)
                .limit(Number(params.pageSize))
                .toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    callback(err);
                }
                callback(null, docs);
            })
        })
    })
};