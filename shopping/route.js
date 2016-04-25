/**
 * Created by waybe on 16/4/18.
 */

var express = require('express');
var products = require('./controllers/products_controller');
var orders = require('./controllers/orders_controller');
var customers = require('./controllers/customers_controller');

module.exports = function (app) {
    app.get('/',function (req,res) {
        res.render('shopping');
    })

    app.get('/products/get', products.getProducts);
    app.get('/orders/get', orders.getOrders);
    app.post('/orders/add', orders.addOrder);
    app.get('/customers/get', customers.getCustomer);
    app.post('/customers/update/shipping', customers.updateShipping);
    app.post('/customers/update/billing', customers.updateBilling);
    app.post('/customers/update/cart', customers.updateCart);
}
