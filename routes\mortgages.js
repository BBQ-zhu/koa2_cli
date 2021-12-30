const router = require('koa-router')()
const config = require('../config')
const {
  mortgages
} = require('../models/mortgages')
router.prefix(config.api + '/customer')
const {
    return200,
    return500,
    dateTime
} = require('../config/error')

//新增抵押客户
router.post('/createMortgages', async ctx => {
    let data = ctx.request.body
    data.time = dateTime()
    await mortgages.create(data).then(rel => {
        return200('新增成功', rel, ctx)
    }).catch(err => {
        return500('新增失败', err, ctx)
    })
})

//查询抵押客户
router.post('/findMortgages', async ctx => {
    let data = ctx.request.body
    var match = {}
    if (data.input) {
        match[data.fuzz] = {
            $regex: data.input
        }
    }
    await mortgages.aggregate([{
                $match: match
            }, //用于过滤数据
            {
                $sort: {
                    "time": -1
                }
            }, //倒叙排序
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
            rel ? return200('抵押客户查询成功', rel, ctx) : return500('抵押客户查询失败', null, ctx)
        })
        .catch(err => {
            return500('抵押客户查询失败', err, ctx)
        })

})

//更新抵押客户
router.post('/updateMortgages', async ctx => {
  let data = ctx.request.body
  data.time = dateTime()
  await mortgages.findOneAndUpdate({
    _id: data._id
  }, data).then(rel => {
    if (rel) {
      return200('修改成功', rel, ctx)
    }
  })
})

//删除抵押客户
router.post('/deleteMortgages', async ctx => {
    let data = ctx.request.body
    await mortgages.findOneAndDelete({
        _id: data._id
    }).then(rel => {
        if (rel) {
            return200('删除成功', rel, ctx)
        }
    })
})

module.exports = router
