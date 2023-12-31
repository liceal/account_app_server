var mongoose = require('mongoose');
const moment = require('moment');
//? 定义模型
var users = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      set(val) {
        if (val) {
          const hash = require('bcrypt').hashSync(val, 10)//10位加密
          return hash
        }
      }
    },
    avatar: {
      type: String,
    },
    createTime: {
      type: Date,
      default: Date.now
    },
    updateTime: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; // 添加 id 字段
        delete ret._id; // 移除 _id 字段
        delete ret.__v; // 移除 __v 字段
        delete ret.password; // 移除 password 字段
        ret.createTime = moment(ret.createTime).format('YYYY-MM-DD HH:mm:ss')
        ret.updateTime = moment(ret.updateTime).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
)

// 在保存文档之前更新更新时间和创建时间
users.pre('save', function (next) {
  const currentDate = new Date();
  this.updateTime = currentDate;
  if (!this.createTime) {
    this.createTime = currentDate;
  }
  next();
});

//? 注册模型
mongoose.model('User', users)

//? 使用User模型
var User = mongoose.model('User');

module.exports = User

//? 对User模型find查找结果
// User.find({}, (err, docs) => {
//   console.log('查询结果', err, docs)
// })

