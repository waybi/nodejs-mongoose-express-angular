var Movie = require('../moudels/movie');
var _ = require('underscore');
var Comment = require('../moudels/comment');
var Category = require('../moudels/category');
var fs = require('fs');
var path = require('path');


//detail page
exports.detail = function(req, res) {
	var id = req.params.id;

	Movie.update({_id: id},{$inc:{pv:1}},function (err) {
		if(err){console.log(err)}
	});
    Movie.findById(id, function(err, movie) { // 根据id查找单条数据
        Comment
            .find({movie:id})
            .populate('from', 'name') // 查找关联表
            .populate('reply.from reply.to', 'name') // 根据外键查找关联表
            .exec(function (err,comments) {
                console.log('回复的东东:')
                console.log(comments)
                res.render('detail', {
                    title: 'imooc' + movie.title,
                    movie: movie,
                    comments: comments // 传给模版用的数据
                })
            })
	})
}

//list page
exports.list = function(req, res) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		res.render('list', {
			title: '列表页',
			movies: movies
		})
	})
}

//admin page
exports.new = function(req, res) {
	Category.find({},function (err,categories) {
		res.render('admin', {
			title: '电影后台录入页',
			categories: categories,
			movie: {}
		})
	})
}

// 更新电影
exports.update = function(req, res) {
	var id = req.params.id;

	if (id) {
		Movie.findById(id, function(err, movie) {
			Category.find({},function (err,categories) {
				res.render('admin', {
					title: 'imooc 后台更新',
					categories: categories,
					movie:movie
				});
			})
		});
	}
}

//--------------------------------------------------------------【请求接口】
// 存储上传海报图片
exports.savePoster = function (req,res,next) {
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path; // 二进制路径
	var originalFilename = posterData.originalFilename; // 上传文件的原始名称

	if(originalFilename){
		fs.readFile(filePath,function (err,data) {
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1]; // 上传图片的类型
			var poster = timestamp + '.' + type; // 生成一个以当前时间命名的文件 此时为空
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster); // 生成一个新的路径
			fs.writeFile(newPath, data, function(err) { // 写入文件
				req.poster = poster;
				console.log(req.poster);
				next();
			})
		});
	}else {
		next()
	}
}

//保存数据到后台
exports.save = function(req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if(req.poster){
		movieObj.poster = req.poster;
	}

	if (id) { // 已经添加过的电影 进行更新
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}

			_movie = _.extend(movie, movieObj); // 更新数据
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err);
				}

				res.redirect('/movie/' + movie._id);
			});
		});
	} else {
		_movie = new Movie(movieObj);
		var categoryId = movieObj.category; // 判断是否选中电影类型按钮
		var categoryName = movieObj.categoryName; // 判断是否自己新增电影类型

		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}

			if(categoryId){ // 选中电影类型按钮 把电影保存到该分类
				Category.findById(categoryId,function (err,category) {
					category.movies.push(movie._id);
					category.save(function (err,category) {
						res.redirect('/movie/' + movie._id);
					})
				});
			}else if(categoryName) { // 新增电影类型
				var category = new Category({ // 创建一个电影分类实例
					name: categoryName,
					movies: [movie._id]
				})

				category.save(function(err, category) {
					movie.category = category._id
					movie.save(function(err, movie) {
						res.redirect('/movie/' + movie._id)
					})
				});

			}

		});
	}
}

//删除数据
exports.del = function(req, res) {
	var id = req.query.id;

	if (id) {
		Movie.remove({
			_id: id
		}, function(err, movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({
					success: 1
				});
			}
		})
	}
}