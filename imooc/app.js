var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 4000;
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const session = require('express-session'); // session持久化
const MongoStore = require('connect-mongo/es5')(session); //坑爹的玩意
var dbUrl = 'mongodb://localhost:27017/imooc';
mongoose.connect(dbUrl);

mongoose.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});
mongoose.connection.once('open',function(){
	console.log('连接数据库成功!');
});

var app = express();
//视图文件的路径
app.set('views','./app/views/pages');
//使用的模板引擎
app.set('view engine','jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(express.multipart());
app.use(cookieParser());
app.use(session({
	resave:false, 
  	saveUninitialized: true, 
	secret:'imooc',
	store:new MongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}));

var env = process.env.NODE_ENV || 'development';
if ('development' === env ) {
	app.set('showStackError',true);
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug',true);
}

//静态资源的路径
app.use(express.static(path.join(__dirname,'public')));
app.listen(port);

// 引入路由
require('./config/route')(app);




//http://r3.ykimg.com/05160000530EEB63675839160D0B79D5
//http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf

