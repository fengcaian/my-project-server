/*
用于给其他所有集合生成主键
 */
var mongodb = require('./db');

function Base(name, id) {
    this.collectionName = name;
    this.collectionId = id;
}
module.exports = Base;

Base.getDocIds = function (params, callback) {
    mongodb.then(function(db) {
        // 读取base集合
        db.collection('base', function (err, collection) {
            if (err) {
                return callback(err);
            }
            if (!params.docName) {
                callback('必须有docName参数');
            }
            new Promise(function (resolve, reject) {
                collection.find({docName: params.docName})
                    .toArray(function(err, docs) {
                        if (err) {
                            reject(err);
                        }
                        resolve(docs);
                    });
            })
                .then(function(res) {
                    var biggestId = 0;
                    var keyList = (res.length && res[0].keyList) || [];
                    biggestId = keyList.length ? keyList[keyList.length - 1].key : 0;
                    console.log('biggestId='+biggestId);
                    if (params.idNumber) {
                        var upLimit = biggestId + params.idNumber + 2;
                        for (var i = biggestId + 1; i < upLimit; i += 1 ) {
                            keyList.push({
                                key: i,
                            });
                        }
                    } else {
                        keyList.push({
                            key: biggestId + 1,
                        });
                    }
                    if (res.length) { // update
                        collection.update(
                            {docName :params.docName},
                            {$set:{keyList: keyList}},
                            {safe: true},
                        function (err) {
                            if (err) {
                                callback(err);
                            }
                            callback(null, keyList);
                        });
                    } else { // save
                        collection.insert(
                            {docName: params.docName, keyList: keyList},
                            {safe: true},
                        function(err) {
                            if (err) {
                                callback(err);
                            }
                            callback(null, keyList);
                        });
                    }
                }, function (err) {
                    return callback(err);
                });
        })
    });
};