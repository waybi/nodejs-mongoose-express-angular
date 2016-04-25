/**
 * Created by waybe on 16/4/12.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var PhotoSchema = new Schema({
    title: String,
    filename: String,
    timestamp: { type: Date, default: Date.now },
    commentId:Schema.ObjectId
})
module.exports = mongoose.model('Photo',PhotoSchema);