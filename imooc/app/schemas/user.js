var mongoose = require('mongoose');
var bcrypt = require('bcrypt'); // 用于密码加密
var SALT_WORK_FACTOR = 10; //加密的等级数
var UserSchema = new mongoose.Schema({
	name:{
		unique:true, //唯一的
		type:String
	},
	password:String,
	// 0 普通用户
	// 1 verified 用户
	// 2 高级用户
	// >10 admin
	// > 50 super admin
	role: {
		type: Number,
		default: 0
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});

//每次保存前都要调用的方法
UserSchema.pre('save',function(next){
	var user = this;
	
	//数据是否是新添加的isNew 自带的属性
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now(); //保存最后修改的时间
	}
	
	// 密码加盐 相当于加密
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if (err) return next(err);
		bcrypt.hash(user.password,salt,function(err,hash){
			if (err) return next(err);
			user.password = hash;
			next(); // 一定要在 genSalt  不然 genSalt 没跑完就保存了 密码没有加盐。
		});
	});
	
})

UserSchema.methods = { // 实例方法
	comparePassword:function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if (err) return cb(err) 
			cb(null,isMatch);
		});
	}
}

UserSchema.statics = { // 静态方法
	fetch: function(cb) { // 取出数据库里所有数据
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) { // 取出数据库里所有数据
		return this
			.findOne({
				_id: id
			})
			.exec(cb)
	}
};

module.exports = UserSchema;