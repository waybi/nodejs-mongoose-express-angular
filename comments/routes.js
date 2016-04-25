/**
 * Created by waybe on 16/4/12.
 */

var crypto = require('crypto');
var express = require('express');
var users = require('./controllers/users_controller');
var photos = require('./controllers/photos_controller');
var comments = require('./controllers/comments_controller');
module.exports = function (app) {
    app.get('/',function (req,res) {
        console.log(req.session);
        if(req.session.user){
            res.render('index',{
                username:req.session.username,
                msg:req.session.msg
            })
        }else{
            req.session.msg = '需要您登录账号才能进入首页';
            res.redirect('/login');
        }
    })
    
    app.get('/login',function (req,res) {
       res.render('login',{
           msg:req.session.msg
       })
    });

    app.get('/signup',function (req,res) {
        res.render('signup',{
            msg:req.session.msg
        })
    });
    
    app.get('/logout',function (req,res) {
        req.session.destroy(function(){
            res.redirect('/login');
        });
    });

    app.get('/user',function (req,res) {
        if(req.session.user){
            res.render('user',{
                msg:req.session.msg
            })
        }else {
            req.session.msg = '验证失败';
            res.redirect('/login');
        }
    });

    // 图片模块
    app.get('/photos',function (req,res) { res.render('photos') });
    app.get('/photos/list',photos.getPhotos);
    app.get('/photo',photos.getPhoto);
    app.post('/photos/save',photos.newPhoto);
    app.get('/photos/new',function (req,res) { res.render('photo_new') }); // 增加图片
    app.get('/comments/get', comments.getComment);
    app.post('/comments/add', comments.addComment); //增加评论



    // 用户模块
    app.post('/signup',users.signup);
    app.post('/login', users.login);
    app.get('/user/profile',users.getUserProfile);
    app.post('/user/update', users.updateUser);
    app.post('/user/delete', users.deleteUser);
}