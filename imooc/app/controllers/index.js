var Movie = require('../moudels/movie');
var Category = require('../moudels/category');

//index page
exports.index = function(req,res){
	Category
		.find({}) //找到所有的分类
		// .populate( {path:'movies',options:{limit:5} }) // 根据movies这个外键去找movies集合(表)的数据
		.populate( {path:'movies'}) // 根据movies这个外键去找movies集合(表)的数据
		.exec(function (err,categories) {
			res.render('index', {
				title: '天天营养剧',
				categories: categories
			})
		})
}

//index search
exports.search = function(req,res){
	var catId = req.query.cat;
	var q = req.query.q;
	var page = parseInt(req.query.p,10) || 0;
	var count = 2;
	var index = page * count;

	if(catId){ // 查找所有电影的分类
		Category
			.find({_id: catId}) //找到所有的分类
			.populate({// 根据movies这个外键去找movies集合(表)的数据
				path:'movies',
				select: 'title poster', // 填充电影得哪些字段,如:title poster 拿出电影两个字段,多余的不取
			})
			.exec(function (err,categories) {
				var category = categories[0] || {};
				var movies = category.movies || [];
				var results = movies.slice(index, index + count);

				res.render('result', {
					title: category.name + '所有结果',
					keyword:  category.name,
					query: 'cat=' + catId,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length / count),
					movies: results
				})
			})
	}else{ // 搜索提交过来的
		Movie
			.find({title: q})
			.exec(function (err,movies) {
				if(err){console.log(err)}
				var results = movies.slice(index, index + count);

				res.render('result', {
					title: '搜索结果',
					keyword: q,
					query: 'q=' + catId,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length / count),
					movies: results
				})
			})
	}
}
