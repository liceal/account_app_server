const Router = require('@koa/router')
const router = new Router()

const UserDB = require('../mongo/user.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwtAuth, secret } = require('./jwtAuth.js')
const moment = require('moment')
// const jwtAuth = require('koa-jwt')

// const secret = 'liceal-secret'

// // 从cookie里面获取token
// const getToken = (ctx) => {
//   if (ctx.cookies.get('token')) {
//     return ctx.cookies.get('token');
//   }
//   return null;
// };

// 前缀 user
router.prefix('/user')
router
  .get('/info', jwtAuth, async (ctx, next) => {
    let userId = ctx.state.user.data._id
    const user = await UserDB.findById(userId)
    if (!user) ctx.throw(422, '未找到用户')
    ctx.body = {
      message: '当前登陆用户信息',
      data: user
    }
  })
  .post('/list', jwtAuth, async (ctx, next) => {

    await UserDB.find({
      username: {
        $regex: ctx.request.body.username || ""
      },
    })
      .then(res => {
        console.log(res);
        ctx.body = {
          message: '用户列表',
          data: res
        }
      })
  })
  .post('/register', async (ctx, next) => {
    console.log(ctx.request.body);
    // 新增
    await UserDB.create(ctx.request.body)
      .then(res => {
        console.log(res);
        ctx.body = {
          message: '新增成功',
          data: res
        };
      })
  })
  .post('/login', async (ctx, next) => {
    // 登陆
    console.log(ctx.request.body);
    const { username, password } = ctx.request.body
    const user = await UserDB.findOne({ username })
    if (!user) ctx.throw(422, '用户未找到')
    console.log(user);
    // 匹配密码
    const isPass = bcrypt.compareSync(password, user.password)
    if (!isPass) ctx.throw(422, '密码错误')
    // 签名
    // 存活时间 毫秒单位
    const maxAge = 1000 * 60 * 60

    const token = jwt.sign({
      data: user,
      // exp: Math.floor(Date.now() / 1000) + 20//存活20秒
      exp: Math.floor((Date.now() + maxAge) / 1000)//存活maxAge时间
    }, secret)

    // token设置到cookie中
    ctx.cookies.set('token', token, {
      maxAge
    })
    ctx.body = {
      message: '登陆成功',
      data: {
        user,
        token
      }
    }
  })
  .get('/loginout', async (ctx, next) => {
    // 删除cookies里面的token
    ctx.cookies.set('token', null)
    ctx.body = {
      message: '登出成功'
    }
  })
  .put('/update', async (ctx, next) => {
    const { id, avatar, username, password } = ctx.request.body
    await UserDB.updateOne(
      { _id: id },
      {
        avatar,
        username,
        password,
        updateTime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
      }
    ).then(async res => {
      if (res.modifiedCount === 1) {
        const user = await UserDB.findById(id)
        ctx.body = {
          message: `ID: ${id} 用户更新成功`,
          data: user
        }
      } else {
        ctx.throw(500, `ID: ${id} 用户不存在`)
      }
    })
  })

module.exports = router