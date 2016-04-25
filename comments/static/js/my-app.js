/**
 * Created by waybe on 16/4/13.
 */
var myApp = angular.module('myApp',[]);
myApp.controller('myController',['$scope','$http', function ($scope,$http) {
    $http.get('user/profile')
        .success(function (data,status,headers,config) {
            console.log(data);
            $scope.user = data; // 接收服务端的json数据
            $scope.error = '';
    })
        .error(function (data,status,headers,config) {
            $scope.user = {};
            $scope.error = data;
    });

}]);
