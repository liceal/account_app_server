const Router = require('@koa/router')
const router = new Router()
const { jwtAuth } = require('./jwtAuth')
const RecordDB = require('../mongo/record.js')

router.prefix('/record')
router.use(jwtAuth)
router
  .post('/list', async (ctx, next) => {
    const { content, type, maxPrice, minPrice } = ctx.request.body
    const query = {
      content: {
        $regex: content || ""
      },
    }
    if (type) {
      query.type = String(type)
    }
    if (maxPrice !== undefined) {
      query.price = {
        ...query.price,
        $lte: maxPrice
      };
    }

    if (minPrice !== undefined) {
      query.price = {
        ...query.price,
        $gte: minPrice
      };
    }

    await RecordDB.find(query)
      .then(res => {
        console.log(res);
        ctx.body = {
          message: '记录列表',
          data: res
        }
      })
  })
  .post('/add', async (ctx, next) => {
    // 新增接口
    await RecordDB.create(ctx.request.body)
      .then(res => {
        console.log(res);
        ctx.body = {
          message: '新增成功',
          data: res
        };
      })
  })
  .del('/del', async (ctx, next) => {
    console.log(ctx.query);
    const { id } = ctx.query
    await RecordDB.deleteOne({
      _id: id
    }).then(res => {
      ctx.body = {
        message: '删除成功',
        data: res
      }
    })
  })
  .put('/update', async (ctx, next) => {
    console.log(ctx.request.body);
    const { id, image, content, price } = ctx.request.body
    await RecordDB.updateOne(
      { _id: id },
      {
        image,
        content,
        price,
        updateTime: Date.now()
      }
    ).then(async res => {
      if (res.modifiedCount === 1) {
        const updatedRecord = await RecordDB.findOne({ _id: id });
        ctx.body = {
          message: '修改成功',
          data: updatedRecord
        }
      } else {
        ctx.throw(500, '修改失败')
      }

    }).catch(e => {
      console.error(e);
      ctx.throw(500, '修改失败')
    })
  })
  .get('/detail', async (ctx, next) => {
    const { id } = ctx.query
    await RecordDB.findById({ _id: id })
      .then(res => {
        console.log(res);
        ctx.body = {
          message: `获取详情`,
          data: res
        }
      })
      .catch(e => {
        console.error(e);
        ctx.throw(500, e)
      })
  })

module.exports = router