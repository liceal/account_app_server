var mongoose = require('mongoose');

//? 远程地址，连接了liceal_mongodb服务 密码 675024132 使用test表
const SERVER_URL = 'mongodb+srv://liceal_mongodb:675024132@cluster0.yfovq2l.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(SERVER_URL);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('连接远程mongodb成功');
});