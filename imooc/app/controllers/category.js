var mongoose = require('mongoose');
var Category = require('../moudels/category');

exports.new = function (req,res) {
    res.render('category_admin', {
        title: '电影分类后台录入',
        category: {}
    })
};

exports.save = function (req,res) {
    var _category = req.body.category;
    var category = new Category(_category);
    console.log(_category);
    category.save(function (err,category) {
        if(err){ console.log(err) }
        res.redirect('/admin/category/list');
    })
};

// catelist page
exports.list = function(req, res) {
    Category.fetch(function(err, categories) {
        if (err) {
            console.log(err)
        }

        res.render('categorylist', {
            title: '电影分类列表页',
            categories: categories
        })
    })
}