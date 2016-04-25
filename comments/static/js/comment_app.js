/**
 * Created by waybe on 16/4/13.
 */
var app = angular.module('myApp',[]);

function  CommentObj($http) {
    this.getComment = function (commentId,callback) {
        $http.get('/comments/get',{params:{commentId:commentId}}) // 去找到图片对应的评论
            .success(function (data) {
                callback(null,data);
            })
            .error(function(data, status, headers, config) {
                callback(data, {});
            });
    };

    this.addComment = function (rootCommentId,parentId,newComment,callback) {
        $http.post('/comments/add',{ rootCommentId: rootCommentId,
                                    parentCommentId: parentId,
                                    newComment: newComment })
            .success(function (data) {
                callback(null,data);
            })
            .error(function (data) {
                
            })
    };
}

app.service('commentSrv',['$http',CommentObj]);
app.controller('photoController',['$scope','$http','commentSrv',function ($scope,$http,commentSrv) {
    $http.get('/photos/list')
        .success(function (data) {
            $scope.photos = data;
            $scope.photo = $scope.photos[0];
            $scope.loadComments();
        })
        .error(function (data) {
            $scope.photos = [];
        });

    $scope.loadComments = function () {
        commentSrv.getComment($scope.photo.commentId,function (err,comment) {
            if(err){
                $scope.commentThread = {}
            }else {
                $scope.commentThread = comment;
            }

        })
    };
    $scope.addReply = function(parentCommentId, subject, body){
        var newComment = {subject:subject, body:body};
        commentSrv.addComment($scope.commentThread._id, parentCommentId, newComment,
            function (err,comment) {
                $scope.loadComments();
        });
    };
    $scope.setPhoto = function (photoId) {
        $http.get('/photo',{params:{photoId:photoId}})
            .success(function (data) {
                $scope.photo = data;
                $scope.loadComments();
            })
            .error(function (data) {
                console.log(data);
                $scope.photo = {};
            })
    };
}]);

