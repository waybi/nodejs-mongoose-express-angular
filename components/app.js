/**
 * Created by waybe on 16/4/20.
 */

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost:27017/words';
var db = mongoose.connect(dbUrl);
mongoose.connection.once('open',function () {
    console.log('连接数据库成功');
})
require('./models/word_model');
var app = express();
app.engine('.html',require('ejs').__express);
app.set('views',__dirname + '/views'); // 模版所在目录
app.set('view engine','html');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var env = process.env.NODE_ENV || 'development';
if ('development' === env ) {
    // app.set('showStackError',true);
    // app.use(logger(':method :url :status'));
    // app.locals.pretty = true;
    mongoose.set('debug',true);
}
require('./routes')(app);
app.use(express.static(path.join(__dirname,'static')));
app.listen(1234);


