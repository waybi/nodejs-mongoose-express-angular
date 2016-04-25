/**
 * Created by waybe on 16/4/12.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var PageSchema = new Schema({
    name:{type:String,unique:true},
    commentId:Schema.ObjectId
})
module.exports = mongoose.model('Page',PageSchema);