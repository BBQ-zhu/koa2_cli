const router = require('koa-router')()
const config = require('../config')
const {
    integrate
} = require('../models/integrate')
router.prefix(config.api + '/service')
const {
    return200,
    return500
} = require('../config/error')

//新增咨询客户
router.post('/createIntegrate', async ctx => {
    let data = ctx.request.body
    data.time = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().slice(2)
    await integrate.create(data).then(rel => {
        return200('新增成功', rel, ctx)
    }).catch(err => {
        return500('新增失败', err, ctx)
    })
})

//查询咨询客户
router.post('/findIntegrate', async ctx => {
    let data = ctx.request.body
    var match = {}
    if(data.category){
        if(data.category == '我的客户'){
            match['$or']=[{status:''},{status:'待审核'},{status:'审核中'},{status:'驳回'},{status:'拒绝'},{status:'通过'}]
            match['manager1'] = data.uid
        }else if(data.category == '公海客户'){
            match['$or']=[{status:'待审核'},{status:'审核中'},{status:'驳回'},{status:'拒绝'},{status:'通过'}]
            match['manager1'] = ''
        }else if(data.category == '全部客户'){
            //不需要做操作
        }
    }
    if(data.classType){
        match[data.classTypename] = {
            $regex: data.classType
        }
    }
    if (data.input) {
        match[data.fuzz] = {
            $regex: data.input
        }
    }
    await integrate.aggregate([{
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
            rel ? return200('综合服务列表查询成功', rel, ctx) : return500('综合服务列表查询失败', null, ctx)
        })
        .catch(err => {
            return500('综合服务列表查询失败', err, ctx)
        })

})

//更新咨询客户
router.post('/updateIntegrate', async ctx => {
    let data = ctx.request.body
    await integrate.findOneAndUpdate({
        _id: data._id
    }, data).then(rel => {
        if (rel) {
            return200('修改成功', rel, ctx)
        }
    })
})

//删除咨询客户
router.post('/deleteIntegrate', async ctx => {
    let data = ctx.request.body
    await integrate.findOneAndDelete({
        _id: data._id
    }).then(rel => {
        if (rel) {
            return200('删除成功', rel, ctx)
        }
    })
})

module.exports = router
