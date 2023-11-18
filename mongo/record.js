var mongoose = require('mongoose');
const moment = require('moment');
// 定义模型
var record = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0
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
        ret.createTime = moment(ret.createTime).format('YYYY-MM-DD HH:mm:ss')
        ret.updateTime = moment(ret.updateTime).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
)

// 在保存文档之前更新更新时间和创建时间
record.pre('save', function (next) {
  const currentDate = new Date();
  this.updateTime = currentDate;
  if (!this.createTime) {
    this.createTime = currentDate;
  }
  next();
});

// 注册模型
mongoose.model('Record', record)

// 使用模型
var Record = mongoose.model('Record');

module.exports = Record


