var Comment = require('../moudels/comment');

//comment
exports.save = function(req,res){
    var _comment = req.body.comment;
    var movieId = _comment.movie;

    if (_comment.cid) { // 是否有评论了 有了就是进行回复了
        Comment.findById(_comment.cid,function (err,comment) {
            var reply = {
                from:_comment.from, // 谁进行回复
                to: _comment.tid, // 回复给谁
                content: _comment.content
            }
            comment.reply.push(reply);
            comment.save(function(err, comment) {
                if (err) {
                    CommentSchema(err);
                }
                // CommentSchema(comment);
                res.redirect('/movie/' + movieId);
            })
        })
    }else {
        // 评论
        var comment = new Comment(_comment);
        comment.save(function(err, comment) {
            if (err) {
                CommentSchema(err);
            }
            // CommentSchema(comment);
            res.redirect('/movie/' + movieId);
        })
    }
}
