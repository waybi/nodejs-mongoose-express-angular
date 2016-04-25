/**
 * Created by waybe on 16/4/12.
 */

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session'); // session持久化
var MongoStore = require('connect-mongo/es5')(session);
var path = require('path');
var dbUrl = 'mongodb://localhost:27017/anmw';
mongoose.connect(dbUrl);
var app = express();

mongoose.connection.on('error', function (error) {
    console.log('数据库连接失败'+ error);
});
mongoose.connection.once('open',function(){
    console.log('连接数据库成功!');
});

app.engine('.html',require('ejs').__express);
app.set('views',__dirname + '/views'); // 模版目录
app.set('view engine','html'); // html模版

app.use(bodyParser.urlencoded({extended: true})); // 把所有请求的数据放入req.body
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session( {
    secret: 'SECRET',
    cookie: {maxAge: 60*60*1000},
    saveUninitialized: true,
    store:new MongoStore({
        url:dbUrl,
        collection:'sessions'
    })
}));

// var env = process.env.NODE_ENV || 'development';
// if ('development' === env ) {
//     app.set('showStackError',true);
//     app.use(logger(':method :url :status'));
//     app.locals.pretty = true;
//     mongoose.set('debug',true);
// }

app.use(express.static(path.join(__dirname,'static')));
require('./routes')(app);
app.listen(3000);