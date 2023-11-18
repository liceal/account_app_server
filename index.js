const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');

app.use(bodyParser())

// mongodb
const mongoDB = require('./mongo/index')

// 路由
const user = require('./router/user.js')
const record = require('./router/record')

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // 在这里进行你的异常处理逻辑
    console.error('捕获的异常:', err);
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message,
      code: err.status
    };
  }
});

app
  .use(user.routes())
  .use(user.allowedMethods())
  .use(record.routes())
  .use(record.allowedMethods())

// 有问题 接口不存在也拦截了，暂时先不用
// app.use(async (ctx, next) => {
//   try {
//     console.log(222, ctx);
//     // 最后成功拦截 封装返回值
//     ctx.body = {
//       message: ctx.message === 'Not Found' ? 'success' : ctx.message,
//       data: ctx.data || {}
//     };
//     next()
//   } catch (err) {
//     console.error('最后捕获处理', err);
//   }

// })

app.listen(30000);