var User = require('../moudels/user'); // 拿到user模型

// showSignup
exports.showSignup = function(req, res) {
	res.render('signup', {
		title: '注册页面'
	})
}

exports.showSignin = function(req, res) {
	res.render('signin', {
		title: '登录页面'
	})
}

// 注册
exports.signup = function(req, res) {
	var _user = req.body.user;
	User.find({
		name: _user.name
	}, function(err, user) { // User model查找name字段看看有没有重复插入相同的用户名
		if (err) {
			console.log(err);
		}
		if (user.length != 0) { //插入相同用户名 此处有点小坑
			console.log('此用户已被注册');
			return res.redirect('/signin');
		} else {
			var user = new User(_user); //生成一个用户
			user.save(function(err, user) { //保存到后台
				if (err) {
					console.log(err);
				}
				console.log('恭喜你 此用户未被使用');
				res.redirect('/admin/user/list');
			})
		}
	})
}

// 登录
exports.signin = function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({
		name: name
	}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (!user) { // 没有这个用户
			return res.redirect('/signup');
		}
		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				console.log(err);
			}
			console.log(isMatch);
			if (isMatch) {
				req.session.user = user;
				console.log('登录成功');
				return res.redirect('/');
			} else {
				console.log('密码错误');
				return res.redirect('/signin');
			}
		})
	})
}

// 退出登录
exports.logout = function(req, res) {
	delete req.session.user;
	//	delete app.locals.user;
	res.redirect('/');
}

//userslist page
exports.userlist = function(req, res) {
	User.fetch(function(err, users) {
		if (err) {
			console.log(err);
		}
		res.render('userlist', {
			title: '用户列表页',
			users: users
		})
	})
}

//权限管理
exports.signinRequired = function(req, res,next) {
	var user = req.session.user;
	if (!user) {
		return res.redirect('/signin');
	}
	next();
}
exports.adminRequired = function(req, res,next) {
	var user = req.session.user;
	if (user.role <= 10) {
		console.log('装逼雷区，屌丝止步'); //权限不够
		return res.redirect('/signin');
	}
	
	next();
}