var mongoose = require('mongoose'),
    Product = mongoose.model('Product');

exports.getProducts = function (req,res) { // 从数据库中列出所有产品
    Product.find()
        .exec(function (err,products) {
            if(!products){
                res.json(404, {msg: '没找到商品'});
            }else {
                res.json(products);
            }
        })
}