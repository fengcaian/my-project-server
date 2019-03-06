const mongodb = require('./db');

function Func (func) {
    this.funcName = func.funcName;
    this.funcKey = func.funcKey;
    this.urlList = func.urlList;
    this.funcDesc = func.funcDesc;
    this.parentId = func.parentId;
    this._id = func._id;
    this.uuid = func.uuid;
}

module.exports = Func;
 // 存储一篇文章及其信息
Func.prototype.save = function(callback) {
    const date = new Date();
    const timestamp = Date.parse(date);
    const time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };

    const func = { // 要存储的文档
        id: 'func_id_' + timestamp,
        funcName: this.funcName,
        funcKey: this.funcKey,
        urlList: this.urlList,
        funcDesc: this.funcDesc,
        time: time,
        parentId: this.parentId
    };

    // 打开数据库
    mongodb.then(function(db) {
        // 读取post集合
        db.collection('funcs', function(err, collection) {
            if (err) {
                return callback(err);
            }
            new Promise(function(resolve, reject) {
                collection
                    .find()
                    .sort({id: -1})
                    .toArray(function(err, docs) {
                        if (err) {
                            reject(err);
                        }
                        resolve(docs);
                    })
            })
            .then(function(res) {
                if (res.length) {
                    func.id = res[0].id + 1;
                } else {
                    func.id = 1;
                }
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
            });
        })
  })
};

Func.prototype.deleteFuncByUuid = function(callback) {
    const func = {
        uuid: this.uuid
    };
    console.log(this.uuid);
    console.log(222);
    mongodb.then(function(db) {
        db.collection('funcs', function(err, collection) {
            if (err) {
                return callback(err);
            }
            console.log(func);
            console.log(111);
            collection.remove({_id: func.uuid}, function(err) {
                if (err) {
                    return callback(err);
                }
                callback(null, '删除成功！');
            });
        });
    });
}

Func.get = function(params, callback) {
    mongodb.then(function(db) {
        // 读取funcs集合
        db.collection('funcs', function(err, collection) {
            if (err) {
                return callback(err);
            }
            const query = {};
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
            console.log(params);
            console.log(query);
            Promise.all(
                [
                    collection.count(true),
                    collection.find(query)
                        .sort({
                            id: -1
                        })
                        .skip(Number(params.currentPage))
                        .limit(Number(params.pageSize))
                        .toArray()
            ]).then(function(res) {
                callback(null, {
                    totalRow: res[0],
                    dataList: res[1]
                });
            }, function(err) {
                callback(err);
            });
        });
    });
};
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