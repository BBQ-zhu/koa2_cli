const router = require('koa-router')()
const config = require('../config')
const KoaBody = require('koa-body') //解析接口请求的参数
router.prefix(config.api + '/contract')
const fs = require('fs')
const Path = require('path')
const control = require('../controller/index')
const {
  contract
} = require('../models/contract')
const {
    return200,
    return500
} = require('../config/error')

let dirname = {
  contractDir: 'contracts'
}

//上传合同文档
router.post('/uploadContractImg', KoaBody({
    multipart: true
}), async (ctx) => {
    let oldname = ctx.request.body.imgurl
    let {
        name,
        path
    } = ctx.request.files.file
    if (oldname) {
        var nameArr = oldname.split('/')
        const filePath = Path.resolve('public/uploads/' + dirname.contractDir + '/' + nameArr[nameArr.length - 1]);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    await control.uploadFile(ctx, dirname.contractDir, name, path).then(res => {
        return200('上传图片成功', res, ctx)
    }).catch(err => {
        return500('上传图片失败', err, ctx)
    })
})

router.post('/delContractImg', async ctx => {
    let {
        productimg
    } = ctx.request.body
    var nameArr = productimg.split('/')
    const filePath = Path.resolve('public/uploads/' + dirname.contractDir + '/' + nameArr[nameArr.length - 1]);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return200('删除图片成功', null, ctx)
    } else {
        return500('删除图片失败', null, ctx)
    }
})

//上传产品信息
router.post('/uploadContract', async (ctx) => {
    let data = ctx.request.body
    data.time = new Date().toLocaleString()
    await contract.create(data).then(rel => {
        return200('新增成功', rel, ctx)
    }).catch(err => {
        return500('新增失败', err, ctx)
    })
})

//查询产品信息
router.post('/findContract', async (ctx) => {
    let data = ctx.request.body
    var match = {}
    if (data.input) {
        match[data.fuzz] = {
            $regex: data.input
        }
    }
    await contract.aggregate([{
                $match: match
            }, //用于过滤数据
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
            console.log(rel)
            rel ? return200('招聘列表查询成功', rel, ctx) : return500('招聘列表查询失败', null, ctx)
        })
        .catch(err => {
            return500('招聘列表查询失败', err, ctx)
        })

})

//删除产品信息
router.post('/delateContract', async (ctx) => {
    let data = ctx.request.body
    await contract.findOneAndDelete({
        _id: data._id
    }).then(rel => {
        if (rel) {
            return200('删除成功', rel, ctx)
        }
    })
})
//修改产品信息
router.post('/updataContract', async (ctx) => {
    let data = ctx.request.body
    await contract.findOneAndUpdate({
        _id: data._id
    }, data).then(rel => {
        if (rel) {
            return200('修改成功', rel, ctx)
        }
    })
})


module.exports = router
