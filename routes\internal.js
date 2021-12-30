const router = require('koa-router')()
const config = require('../config')
const {
    internal
} = require('../models/internal')
router.prefix(config.api + '/internal')
const {
    return200,
    return500,
    dateTime
} = require('../config/error')

//新增内部资料
router.post('/createInternal', async ctx => {
    let data = ctx.request.body
    data.time = dateTime()
    await internal.create(data).then(rel => {
        return200('新增成功', rel, ctx)
    }).catch(err => {
        return500('新增失败', err, ctx)
    })
})

//查询内部资料
router.post('/findInternal', async ctx => {
    let data = ctx.request.body
    var match = {}
    if (data.input) {
        match[data.fuzz] = {
            $regex: data.input
        }
    }
    await internal.aggregate([{
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
            rel ? return200('代办列表查询成功', rel, ctx) : return500('代办列表查询失败', null, ctx)
        })
        .catch(err => {
            return500('代办列表查询失败', err, ctx)
        })

})

//更新内部资料
router.post('/updateInternal', async ctx => {
    let data = ctx.request.body
    data.time = dateTime()
    await internal.findOneAndUpdate({
        _id: data._id
    }, data).then(rel => {
        if (rel) {
            return200('修改成功', rel, ctx)
        }
    })
})

//删除内部资料
router.post('/deleteInternal', async ctx => {
    let data = ctx.request.body
    await internal.findOneAndDelete({
        _id: data._id
    }).then(rel => {
        if (rel) {
            return200('删除成功', rel, ctx)
        }
    })
})

module.exports = router
