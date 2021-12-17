const router = require('koa-router')()
const config = require('../config')
const {
  statistics
} = require('../models/statistic')
router.prefix(config.api + '/statistics')
const {
  return200,
  return500
} = require('../config/error')

//新增访问量统计
router.post('/createStatistics', async ctx => {
  let data = ctx.request.body
  data.time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(2)
  await statistics.create(data).then(rel => {
    return200('新增成功', rel, ctx)
  }).catch(err => {
    return500('新增失败', err, ctx)
  })
})

//查询访问量统计
router.post('/findStatistics', async ctx => {
  let data = ctx.request.body
  let match = {}
  if (data.year) {
    match['year'] = data.year
  }
  await statistics.find(match).then(rel => {
    rel ? return200('访问量统计查询成功', rel, ctx) : return500('访问量统计查询失败', null, ctx)
  })
    .catch(err => {
      return500('访问量统计查询失败', err, ctx)
    })

})

//更新访问量统计
router.post('/updateStatistics', async ctx => {
  let data = ctx.request.body
  await statistics.findOneAndUpdate({
    year: data.year
  }, data).then(rel => {
    if (rel) {
      return200('修改成功', rel, ctx)
    }
  })
})
module.exports = router
