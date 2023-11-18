var mongoose = require('mongoose');

// 定义模型
var record = mongoose.Schema({
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
})

// 在保存文档之前更新更新时间和创建时间
record.pre('save', function (next) {
  const currentDate = new Date();
  this.updateTime = currentDate;
  if (!this.createdAt) {
    this.createTime = currentDate;
  }
  next();
});

// 注册模型
mongoose.model('Record', record)

// 使用模型
var Record = mongoose.model('Record');

module.exports = Record


