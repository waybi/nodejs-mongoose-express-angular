var app = angular.module('myApp', []);
app.controller('shoppingController', ['$scope', '$http', '$window',
    function($scope, $http, $window) {
        $scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
        $scope.years = [2014,2015,2016,2017,2018,2019,2020];
        $scope.content = '/products.html';
        $http.get('/products/get')
            .success(function (data) { //查询数据库产品列表
                $scope.products = data;
                $scope.product = data[0];
            })
            .error(function (data) {
                $scope.products = [];
            });

        $http.get('/customers/get') // 查询数据库用户列表
            .success(function (data) {
                $scope.customer = data;
            })
            .error(function (data) {
                $scope.customer = [];
            });

        $http.get('/orders/get')
            .success(function (data) {
                $scope.orders = data;
            })
            .error(function (data) {
                $scope.orders = data;
            });

        $scope.setProduct = function (productId) {
            $scope.product = this.product;
            $scope.content = '/product.html';
        };
        $scope.setContent = function (filename) {
            $scope.content = filename;
        };

        $scope.cartTotal = function () {
            var total = 0;
            for (var i = 0; i < $scope.customer.cart.length; i++ ){
                var item = $scope.customer.cart[i];
                total += item.quantity * item.product[0].price;
            }
            $scope.shipping = total * .05;
            return total + $scope.shipping;
        }

        $scope.addToCart = function (productId) { // 添加商品到购物车
            var found = false;
            for (var i=0; i<$scope.customer.cart.length; i++){
                var item = $scope.customer.cart[i];
                if (item.product[0]._id == productId) {
                    item.quantity += 1;
                    found = true;
                }
            }

            if (!found) {
                $scope.customer.cart.push({quantity: 1, product: [this.product]});
            }
            $http.post('/customers/update/cart',{updatedCart:$scope.customer.cart}) //提交到后台
                .success(function (data) {
                    $scope.content = '/cart.html';
                })
                .error(function (data) {
                    $window.alert(data);
                })
        };

        $scope.checkout = function () {
            $http.post('/customers/update/cart',
                {updatedCart: $scope.customer.cart})
                .success(function (data, status, headers, config) {
                    $scope.content = '/shipping.html';
                })
                .error(function (data, status, headers, config) {
                    $window.alert(data);
                });
        };

        $scope.setShipping = function () {
            $http.post('/customers/update/shipping',
                {updatedShipping: $scope.customer.shipping[0]})
                .success(function (data, status, headers, config) {
                    $scope.content = '/billing.html';
                })
                .error(function (data, status, headers, config) {
                    $window.alert(data);
                });
        };
        
        $scope.verifyBilling = function (ccv) {
            $scope.ccv = ccv;
            $http.post('/customers/update/billing',
                {updatedBilling: $scope.customer.billing[0], ccv: ccv})
                .success(function (data, status, headers, config) {
                    $scope.content = '/review.html';
                })
                .error(function (data, status, headers, config) {
                    $window.alert(data);
                });
        }
        
        $scope.makePurchase = function () {
            $http.post('/orders/add',
                {
                    orderBilling:$scope.customer.billing[0],
                    orderShipping:$scope.customer.shipping[0],
                    orderItems:$scope.customer.cart
                })
                .success(function (data) {
                    alert('败家成功');
                    $scope.content = '/products.html';
                })
        }

    }]);
