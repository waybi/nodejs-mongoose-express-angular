/**
 * Created by waybe on 16/4/12.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var UserSchema = new Schema({
    username:{type:String,unique:true},
    email:String,
    favorite:String,
    hashed_password:String
})
module.exports = mongoose.model('User',UserSchema);