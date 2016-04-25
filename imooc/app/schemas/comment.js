var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new mongoose.Schema({
    movie: {type: ObjectId, ref: 'Movie'}, // 哪个电影
    from: {type: ObjectId, ref: 'User'}, // 哪个用户进行了评论
    // 回复层
    reply: [{
        from: {type: ObjectId, ref: 'User'}, // 谁进行回复
        to: {type: ObjectId, ref: 'User'}, // 回复谁
        content: String, // 回复内容
    }],
    content: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

//每次在存储数据之前都会来调用一下这个方法
CommentSchema.pre('save', function (next) {
    //数据是否是新添加的
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next();
});

CommentSchema.statics = {
    fetch: function (cd) { // 取出数据库里所有数据
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cd)
    },
    findById: function (id, cd) { // 取出数据库里所有数据
        return this
            .findOne({
                _id: id
            })
            .exec(cd)
    }
};

module.exports = CommentSchema;