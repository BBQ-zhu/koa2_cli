const router = require('koa-router')()
const config = require('../config')
const {
    customer
} = require('../models/customer')
const {
    enterprise
} = require('../models/enterprise')
router.prefix(config.api + '/customer')
const {
    return200,
    return500,
    dateTime
} = require('../config/error')

//查询客户信息
router.post('/findCustomer', async ctx => {
    let data = ctx.request.body
    var match = {}
    if (data.category) {
        if (data.category == '我的客户') {
            match['$or'] = [{ status: '待审核' }, { status: '审核中' }, { status: '驳回' }, { status: '拒绝' }, { status: '通过' }]
            match['manager2'] = data.uid
        } else if (data.category == '公海客户') {
            match['$or'] = [{ status: '待审核' }, { status: '审核中' }, { status: '驳回' }, { status: '拒绝' }, { status: '通过' }]
            match['manager2'] = ''
        } else if (data.category == '全部客户') {
            //不需要做操作
        }
    }
    if (data.input) {
        if (data.only) { //传参带only为true的必须全等
            match[data.fuzz] = data.input
        } else {
            if(data.fuzz == 'schedate'){
                match[data.fuzz] = parseInt(data.input)
            }else{
                match[data.fuzz] = {
                    $regex: data.input
                }
            }
        }
    }
    await customer.aggregate([{
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
            rel ? return200('客户列表查询成功', rel, ctx) : return500('客户列表查询失败', null, ctx)
        })
        .catch(err => {
            return500('客户列表查询失败', err, ctx)
        })

})
//新增客户信息
router.post('/createCustomer', async ctx => {
    let data = ctx.request.body
    data.time = dateTime()
    await customer.create(data).then(rel => {
        return200('新增成功', rel, ctx)
    }).catch(err => {
        return500('新增失败', err, ctx)
    })
})
//更新客户信息
router.post('/updateCustomer', async ctx => {
    let data = ctx.request.body
    data.time = dateTime()
    await customer.findOneAndUpdate({
        _id: data._id
    }, data).then(rel => {
        if (rel) {
            return200('修改成功', rel, ctx)
        }
    })
})

//删除客户信息
router.post('/deleteCustomer', async ctx => {
    let data = ctx.request.body
    await customer.findOneAndDelete({
        _id: data._id
    }).then(rel => {
        if (rel) {
            return200('删除成功', rel, ctx)
        }
    })
})

/********************************************企业资料管理********************************************************************** */

//新增企业资料
router.post('/createEnterprise', async ctx => {
    let data = ctx.request.body
    data.time = dateTime()
    await enterprise.create(data).then(rel => {
        return200('新增成功', rel, ctx)
    }).catch(err => {
        return500('新增失败', err, ctx)
    })
})

//查询客户信息
router.post('/findEnterprise', async ctx => {
    let data = ctx.request.body
    var match = {}
    if (data.category) {
        if (data.category == '我的客户') {
            match['$or'] = [{ status: '待审核' }, { status: '审核中' }, { status: '驳回' }, { status: '拒绝' }, { status: '通过' }]
            match['manager2'] = data.uid
        } else if (data.category == '公海客户') {
            match['$or'] = [{ status: '待审核' }, { status: '审核中' }, { status: '驳回' }, { status: '拒绝' }, { status: '通过' }]
            match['manager2'] = ''
        } else if (data.category == '全部客户') {
            //不需要做操作
        }
    }
    if (data.classType) {
        match[data.classTypename] = {
            $regex: data.classType
        }
    }
    if (data.input) {
        if (data.only) {
            match[data.fuzz] = data.input
        } else {
            if(data.fuzz == 'schedate'){
                match[data.fuzz] = parseInt(data.input)
            }else{
                match[data.fuzz] = {
                    $regex: data.input
                }
            }
            // match[data.fuzz] = {
            //     $regex: data.input
            // }
        }

    }
    await enterprise.aggregate([{
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
            rel ? return200('招聘列表查询成功', rel, ctx) : return500('招聘列表查询失败', null, ctx)
        })
        .catch(err => {
            return500('招聘列表查询失败', err, ctx)
        })

})

//更新客户信息
router.post('/updateEnterprise', async ctx => {
    let data = ctx.request.body
    data.time = dateTime()
    await enterprise.findOneAndUpdate({
        _id: data._id
    }, data).then(rel => {
        if (rel) {
            return200('修改成功', rel, ctx)
        }
    })
})

//删除客户信息
router.post('/deleteEnterprise', async ctx => {
    let data = ctx.request.body
    await enterprise.findOneAndDelete({
        _id: data._id
    }).then(rel => {
        if (rel) {
            return200('删除成功', rel, ctx)
        }
    })
})

module.exports = router
