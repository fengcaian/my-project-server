var mongodb = require('./db');

function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}

module.exports = Post;
 // 存储一篇文章及其信息
Post.prototype.save = function (callback) {
    var date = new Date();
    var time = {
        data: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };

    var post = { // 要存储的文档
        name: this.name,
        title: this.title,
        post: this.post,
        time: time
    };

    // 打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取post集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.clone();
                return callback(err);
            }
            // 将文档插入post集合
            collection.insert(post, {
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

Post.get = function (name, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取posts集合
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name
            }
            // 根据query对象查询文章
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    callback(err);
                }
                callback(null, docs);
            })
        })
    })
};