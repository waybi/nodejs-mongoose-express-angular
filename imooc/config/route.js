var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(app) {
	//预处理 user
	app.use(function(req, res, next) {
		var _user = req.session.user;
		console.log('req.session:');
		console.log(_user);
		app.locals.user = _user; // 放到本地 以便以后在模版可以直接使用
		next();
	})
	
	//--------------------------------------------------------------Index
	//首页
	app.get('/',Index.index);

	//--------------------------------------------------------------User
	// signup 注册
	app.post('/user/signup', User.signup);
	// signin 登录
	app.post('/user/signin', User.signin);
	app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
	// 退出登录
	app.get('/logout', User.logout);
	//用户列表 User.signinRequired,User.adminRequired,User.userlist 这三个东东相当于三个callback 顺序很重要
	app.get('/admin/user/list',User.signinRequired,User.adminRequired,User.userlist);
	
	//--------------------------------------------------------------Movie
	//detail page
	app.get('/movie/:id',Movie.detail);
	//list page
	app.get('/admin/movie/list', Movie.list);
	//admin page
	app.get('/admin/movie/new', Movie.new);
	// 更新电影
	app.get('/admin/movie/update/:id',Movie.update);
	//录入新数据 -----【请求接口】-----
	app.post('/admin/movie/save',multipartMiddleware,Movie.savePoster, Movie.save);
	//删除数据
	app.delete('/admin/movie/list',Movie.del);

	//--------------------------------------------------------------评论模块
	app.post('/user/comment', User.signinRequired, Comment.save);

	//--------------------------------------------------------------电影分类
	app.get('/admin/category/new',User.signinRequired,User.adminRequired,Category.new);
	app.post('/admin/category', User.signinRequired, User.adminRequired,Category.save);
	app.get('/admin/category/list', User.signinRequired, User.adminRequired,Category.list);

	// 结果页
	app.get('/results', Index.search);
}