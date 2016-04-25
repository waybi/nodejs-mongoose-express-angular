/**
 * Created by waybe on 16/4/13.
 */
var Photo = require('../models/photo_model');

exports.getPhoto = function (req,res) {
    Photo.findOne({_id: req.query.photoId})
        .exec(function (err,photo) {
            if(!photo){
                res.json(404,{msg:'没找到这个照片'})
            }else {
                res.json(photo);
            }
        })
};


exports.getPhotos = function (req,res) {
    Photo.find().exec(function (err,photos) {
        if(!photos){
            res.json(404, {msg: '没找到照片'})
        }else {
            res.json(photos);
        }
    });
};

exports.newPhoto = function (req,res) {
    var photo = new Photo(req.body); // 生成一个图片文档
    photo.save(function (err,photo) {
        if (err) {
            console.log(err);
        }
        console.log('保存成功');
        res.redirect('/photos');
    });
}