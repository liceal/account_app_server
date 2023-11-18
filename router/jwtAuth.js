const koaJwt = require('koa-jwt')

const secret = 'liceal-secret'

// 从cookie里面获取token
const getToken = (ctx) => {
  if (ctx.cookies.get('token')) {
    return ctx.cookies.get('token');
  }
  return null;
};

module.exports = {
  jwtAuth: koaJwt({ secret, getToken }),
  secret,
}