var mongoose = require('mongoose'),
    Customer = mongoose.model('Customer'),
    Order = mongoose.model('Order'),
    Address = mongoose.model('Address'),
    Billing = mongoose.model('Billing');

exports.getOrders = function (req,res) {
    Order.find({userid:'customerA'})
        .exec(function (err, orders) {
            if(!orders){
                res.json(404, {msg: '您还没有订单'});
            }else{
                res.json(orders);
            }
        });
}



exports.addOrder = function (req, res) {
    var orderShipping = new Address(req.body.orderShipping);
    var orderBilling = new Billing(req.body.orderBilling);
    var orderItems = req.body.orderItems;
    var newOrder = new Order({
        userid: 'customerA',
        items:orderItems,
        shipping:orderShipping,
        billing:orderBilling
    });
    newOrder.save(function (err,results) {
        if(err){
            res.json(500, "保存订单失败");
        }else {
            Customer.update({userid:'customerA'})
                .exec(function (err,results) {
                    if(err){
                        res.json(404,{msg:'用户订单详情更新失败'})
                    }else {
                        res.json({msg: "用户订单更新成功"});
                    }
                })
        }
    })
}