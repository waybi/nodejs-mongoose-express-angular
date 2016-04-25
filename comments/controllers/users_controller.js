/**
 * Created by waybe on 16/4/13.
 */
var crypto = require('crypto'); // 加密
var User = require('../models/users_model');
function  hashPW(pwd) {
    return crypto.createHash('sha256').update(pwd).
    digest('base64').toString();
}

exports.signup = function (req,res) {
    var user = new User({username:req.body.username});
    user.set('hashed_password',hashPW(req.body.password));
    user.save(function (err) {
        if(err){
            res.session.error = err;
            res.redirect('/signup');
        }

        req.session.user = user.id;
        req.session.username = user.username;
        req.session.msg = user.username + '已经进入直播室';
        res.redirect('/');
    })
};

exports.login = function (req,res) {
    User.findOne({username:req.body.username})
        .exec(function (err,user) {
            if (!user){
                err = '没有这个用户'
            }else if(user.hashed_password === hashPW(req.body.password.toString())){
                req.session.regenerate(function () {
                    req.session.user = user.id;
                    req.session.username = user.username;
                    req.session.msg = user.username;
                    res.redirect('/');
                })
            }else {
                err = '密码错误';
            }
            if(err){
                req.session.regenerate(function(){
                    req.session.msg = err;
                    res.redirect('/login');
                });
            }
        });
};

exports.getUserProfile = function (req,res) {
    User.findOne({_id:req.session.user})
        .exec(function (err,user) {
            if(!user){
                res.json(404,{err:'没有这个用户'});
            }else {
                res.json(user); // 向客户端发送json数据
            }
        })
};

exports.updateUser = function (req,res) { // 更新用户
    console.log(req.body);
    console.log(req.body.favorite);
    User.findOne({_id:req.session.user})
        .exec(function (err,user) {
            user.set('email',req.body.email);
            user.set('favorite',req.body.favorite);
            user.save(function (err,user) {
                console.log(user);
                if(err){ res.session.error = err; }
                req.session.msg = '用户资料已经更新';
                res.redirect('/user');
            })
        });
};

exports.deleteUser = function (req,res) { // 删除用户
    User.findOne({_id:req.session.user})
        .exec(function (err,user) {
           if(user){
               user.remove(function (err) {
                   if(err){ req.session.msg = err; }
                   req.session.destroy(function () {
                       res.redirect('/login');
                   })
               })
           }
        })
}

