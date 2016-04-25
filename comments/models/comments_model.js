/**
 * Created by waybe on 16/4/12.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ReplySchema = new Schema,
    CommentThreadSchema = new Schema;
ReplySchema.add({
    username: String,
    subject: String,
    timestamp: { type: Date, default: Date.now },
    body: String,
    replies:[ReplySchema]
});
CommentThreadSchema.add({
    title: String,
    replies:[ReplySchema]
});
exports.Reply = mongoose.model('Reply', ReplySchema);
exports.CommentThread = mongoose.model('CommentThread', CommentThreadSchema);