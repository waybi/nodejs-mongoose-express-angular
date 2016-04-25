var CommentThread = require('../models/comments_model').CommentThread;
var Reply = require('../models/comments_model').Reply;

exports.getComment = function(req, res) {
    // console.log('查找评论');
    // console.log(req.body);
    // console.log(req.query);
    CommentThread.findOne({_id:req.query.commentId})
        .exec(function (err,CommentThread) {
            if(err){
                res.json(404, {msg: 'CommentThread Not Found.'});
            }else {
                res.json(CommentThread);
            }
        });
};

exports.addComment = function (req,res) {
    console.log('添加评论');
    console.log(req.body);
    CommentThread.findOne({_id:req.body.rootCommentId})
        .exec(function (err,commentThread) {
            if(!commentThread){
                res.json(404,{msg:'没有CommentThread'})
            }else{
                var newComment = new Reply(req.body.newComment);
                newComment.username = generateRandomUsername();
                addComment(req, res, commentThread, commentThread, req.body.parentCommentId, newComment);
            }
        })
}

function  addComment(req, res, commentThread, currentComment, parentId, newComment) {
    if(commentThread.id == parentId){ // 如果是评论图片 而不是回复某个人
        commentThread.replies.push(newComment);
        updateCommentThread(req, res, commentThread); // 更新数据库
    }else {
        for(var i =0; i < currentComment.replies.length; i++){ // 当前评论这张图片的人数
            var c = currentComment.replies[i];
            if (c._id == parentId){ // 找到要回复的人
                c.replies.push(newComment);
                updateCommentThread(req, res, commentThread);
            }else {
                addComment(req, res, commentThread, c, parentId, newComment); // 继续查找
            }
        }
    }
}

function  updateCommentThread(req, res, commentThread) {
    CommentThread.update({_id:commentThread.id},{$set:{replies:commentThread.replies}})
        .exec(function (err,savedComment) {
            if(err){
                res.json(404, {msg: '更新CommentThread失败'});
            }else{
                res.json({msg: "success"});
            }
        })
}

function generateRandomUsername(){
    var users=['DaNae', 'Brad', 'Brendan', 'Caleb', 'Aedan', 'Taeg'];
    return users[Math.floor((Math.random()*5))];
}


