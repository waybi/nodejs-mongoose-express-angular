/**
 * Created by waybe on 16/4/18.
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var dbUrl = 'mongodb://localhost:27017/anmw_shop';
var db = mongoose.connect(dbUrl);
var app =express();
require('./models/cart_model.js');
app.engine('.html',require('ejs').__express);
app.set('views',__dirname + '/views'); 
app.set('view engine','html');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'static'))); // 设置静态目录
require('./route')(app);
app.listen(1234);



