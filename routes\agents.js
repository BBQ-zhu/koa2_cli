const router = require('koa-router')()
const config = require('../config')
const {
  agents
} = require('../models/agents')
router.prefix(config.api + '/agents')
const {
  return200,
  return500
} = require('../config/error')

//新增代办
router.post('/createAgent', async ctx => {
  let data = ctx.request.body
  data.time = new Date().toLocaleString()
  await agents.create(data).then(rel => {
    return200('新增成功', rel, ctx)
  }).catch(err => {
    return500('新增失败', err, ctx)
  })
})

//查询代办
router.post('/findAgent', async ctx => {
  let data = ctx.request.body
  var match = {}
  if(data.input){
    match[data.fuzz] = {$regex:data.input}
  }
  await agents.aggregate([{
        $match: match
      }, //用于过滤数据
      { $sort:{"time":-1} }, //倒叙排序
      {
        $project: {
          __v: 0
        }
      },
      {
        "$facet": {
          "total": [{
            "$count": "total"
          }],
          "data": [{
              "$skip": Number(data.skip)
            },
            {
              "$limit": Number(data.limit)
            }
          ]
        }
      }
    ])
    .then(rel => {
      rel ? return200('代办列表查询成功', rel, ctx) : return500('代办列表查询失败', null, ctx)
    })
    .catch(err => {
      return500('代办列表查询失败', err, ctx)
    })

})

//更新代办
router.post('/updateAgent', async ctx => {
  let data = ctx.request.body
  await agents.findOneAndUpdate({
    _id: data._id
  }, data).then(rel => {
    if (rel) {
      return200('修改成功', rel, ctx)
    }
  })
})

//删除代办
router.post('/deleteAgent', async ctx => {
  let data = ctx.request.body
  await agents.findOneAndDelete({
    _id: data._id
  }).then(rel => {
    if (rel) {
      return200('删除成功', rel, ctx)
    }
  })
})

module.exports = router
