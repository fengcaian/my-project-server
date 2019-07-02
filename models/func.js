var mongodb = require('./db');
var Base = require('./base');

function Func (func) {
    this.funcName = func.funcName;
    this.funcKey = func.funcKey;
    this.urlList = func.urlList;
    this.funcDesc = func.funcDesc;
    this.parentId = func.parentId;
    this.id = func.id;
    this._id = func._id;
}

module.exports = Func;
 // 存储一篇文章及其信息
Func.prototype.save = function(callback) {
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
        funcId: 'func_id_' + timestamp,
        funcName: this.funcName,
        funcKey: this.funcKey,
        urlList: this.urlList,
        funcDesc: this.funcDesc,
        time: time,
        parentId: Number(this.parentId)
    };

    mongodb.then(function(db) {
        // 读取funcs集合
        db.collection('funcs', function(err, collection) {
            if (err) {
                callback(err);
            }
            new Promise(function(resolve, reject) {
                Base.getDocIds({docName: 'funcs'}, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                })
            })
            .then(function(res) {
                func.id = res[res.length - 1].key; // 暂时考虑每次新增一个doc, 不考虑文档批量操作
                // 将文档插入post集合
                collection
                    .insert(func, {
                        safe: true
                    }, function(err) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, '保存成功！');
                    });
            }, function (err) {
                callback(err);
            });
        })
  })
};

Func.prototype.update = function(callback) {
    var id = this.id;
    var set = {
        funcName: this.funcName,
        funcDesc: this.funcDesc
    };
    mongodb.then(function(db) {
        db.collection('funcs', function(err, collection) {
            if (err) {
                callback(err);
            }
            collection.update(
                {id: Number(id)},
                {$set: set},
                {safe: true}, function(err) {
                    if (err) {
                        callback(err);
                    }
                    callback(null);
                });
        });
    });
}

Func.prototype.deleteFunc = function(callback) {
    var func = {
        id: Number(this.id)
    };
    mongodb.then(function(db) {
        db.collection('funcs', function(err, collection) {
            if (err) {
                return callback(err);
            }
            collection.remove(func)
                .then((res) => {
                    return callback(null, res);
                }, function() {
                    return callback(err);
                });
        });
    });
};

Func.get = function(params, callback) {
    mongodb.then(function(db) {
        // 读取funcs集合
        db.collection('funcs', function(err, collection) {
            if (err) {
                return callback(err);
            }
            var query = {};
            if (params.keyWord) {
                query.$or = [
                    {
                        funcName: params.keyWord
                    },
                    {
                        funcKey: params.keyWord
                    },
                    {
                        funcDesc: params.keyWord
                    }
                ];
            }
            Promise.all(
                [
                    collection.count(true),
                    collection.find(query)
                        .sort({
                            id: -1
                        })
                        .skip((Number(params.currentPage) - 1) * Number(params.pageSize))
                        .limit(Number(params.pageSize))
                        .toArray()
            ]).then(function(res) {
                callback(null, {
                    totalRow: res[0],
                    dataList: res[1] || []
                });
            }, function(err) {
                callback(err);
            });
        });
    });
};
Func.getFuncById = function(params, callback) {
    mongodb.then(function(db) {
        db.collection('funcs', function(err, collection) {
            if (err) {
                return callback(err);
            }
            if (!params.id) {
                return callback('id不存在！');
            }
            var query = {
                id: Number(params.id)
            };
            collection.findOne(query, function(error, result) {
                if (error) {
                    return callback(error);
                }
                callback(null, result);
            })
        });
    });
}
Func.getAll = function(params, callback) {
    mongodb.then(function(db) {
        db.collection('funcs', function(err, collection) {
            if (err) {
                return callback(err);
            }
            collection.find()
                .sort({
                    id: -1,
                })
                .toArray(function(err, docs) {
                    if (err) {
                        callback(err);
                    }
                    callback(null, {
                        dataList: docs
                    });
                });
        });
    });
};