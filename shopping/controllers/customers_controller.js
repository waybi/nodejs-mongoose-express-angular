var mongoose = require('mongoose'),
    Customer = mongoose.model('Customer'),
    Address = mongoose.model('Address'),
    Billing = mongoose.model('Billing');

exports.getCustomer = function (req,res) {
    Customer.findOne({userid: 'customerA'})
        .exec(function (err,customer) {
            if(!customer){
                res.json(404,{msg:'没有找到这个客户'})
            }else {
                res.json(customer);
            }
        })
};

exports.updateCart = function (req,res) {
    Customer.update({userid: 'customerA'},
        {$set:{cart:req.body.updatedCart}}) // 设置现有文档中一个字段的值
    .exec(function (err,customer) {
        if (err || customer < 1){
            res.json(404, {msg: '更新cart字段失败'});
        } else {
            res.json({msg: "用户的购物车已更新"});
        }
    })
};

exports.updateShipping = function (req,res) {
    var newShipping = new Address(req.body.updatedShipping);
    Customer.update({ userid: 'customerA' },
        {$set:{shipping:[newShipping.toObject()]}})
        .exec(function (err,results) {
            if (err || results < 1){
                res.json(404, {msg: '收货详情更新失败'});
            } else {
                res.json({msg: "已经更新用户收货详情"});
            }
        })
};

exports.updateBilling = function(req, res) {
    var newBilling = new Billing(req.body.updatedBilling);
    Customer.update({ userid: 'customerA' },
        {$set:{billing:[newBilling.toObject()]}})
        .exec(function (err,results) {
            if (err || results < 1){
                res.json(404, {msg: 'Billing更新失败'});
            } else {
                res.json({msg: "Billing已更新"});
            }
        })
};