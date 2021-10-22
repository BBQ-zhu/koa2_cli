const router = require('koa-router')()
const config = require('../config')
const {
    logs
} = require('../models/logs')
router.prefix(config.api + '/logs')
const {
    return200,
    return500
} = require('../config/error')

//新增操作日志
router.post('/createlogs', async ctx => {
    let data = ctx.request.body
    data.time = new Date().toLocaleDateString() +' '+ new Date().toLocaleTimeString().slice(2)
    await logs.create(data).then(rel => {
        return200('新增成功', rel, ctx)
    }).catch(err => {
        return500('新增失败', err, ctx)
    })
})

//查询操作日志
router.post('/findlogs', async ctx => {
    let data = ctx.request.body
    var match = {}
    if (data.input) {
        match[data.fuzz] = {
            $regex: data.input
        }
    }
    await logs.aggregate([{
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
            rel ? return200('操作日志查询成功', rel, ctx) : return500('操作日志查询失败', null, ctx)
        })
        .catch(err => {
            return500('操作日志查询失败', err, ctx)
        })

})

//更新操作日志
// router.post('/updatelogs', async ctx => {
//   let data = ctx.request.body
//   await logs.findOneAndUpdate({
//     _id: data._id
//   }, data).then(rel => {
//     if (rel) {
//       return200('修改成功', rel, ctx)
//     }
//   })
// })

//删除操作日志
router.post('/deletelogs', async ctx => {
    let data = ctx.request.body
    await logs.findOneAndDelete({
        _id: data._id
    }).then(rel => {
        if (rel) {
            return200('删除成功', rel, ctx)
        }
    })
})

module.exports = router
