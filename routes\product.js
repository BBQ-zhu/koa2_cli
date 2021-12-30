const router = require('koa-router')()
const config = require('../config')
const KoaBody = require('koa-body') //解析接口请求的参数
router.prefix(config.api + '/uploads')
const fs = require('fs')
const Path = require('path')
const control = require('../controller/index')
const {
    Recruiting
} = require('../models/recruiting')
const {
    Product,
    productClass
} = require('../models/product')
const {
    return200,
    return500,
    dateTime
} = require('../config/error')

let dirname = {
    productlogoDir: 'productLogo',
    productDir: 'products',
    iconlImgDir: 'icons'
}

//上传产品logo
router.post('/uploadProductLogo', KoaBody({
    multipart: true
}), async (ctx) => {
    var dir = dirname.productlogoDir //定义上传目录
    let oldname = ctx.request.body.productlogo
    let {
        name,
        path
    } = ctx.request.files.file
    if (oldname) {
        var nameArr = oldname.split('/')
        const filePath = Path.resolve('public/uploads/' + dirname.productlogoDir + '/' + nameArr[nameArr.length - 1]);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    await control.uploadFile(ctx, dir, name, path).then(res => {
        return200('上传图片成功', res, ctx)
    }).catch(err => {
        return500('上传图片失败', err, ctx)
    })
})

//删除产品logo
router.post('/delProductLogo', async ctx => {
    let {
        productlogo
    } = ctx.request.body
    if (productlogo) {
        var nameArr = productlogo.split('/')
        const filePath = Path.resolve('public/uploads/' + dirname.productlogoDir + '/' + nameArr[nameArr.length - 1]);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    return200('删除图片成功', null, ctx)
})

//上传产品图片
router.post('/uploadProductImg', KoaBody({
    multipart: true
}), async (ctx) => {
    var dir = dirname.productDir //定义上传目录
    let oldname = ctx.request.body.productimg
    let {
        name,
        path
    } = ctx.request.files.file
    if (oldname) {
        var nameArr = oldname.split('/')
        const filePath = Path.resolve('public/uploads/' + dirname.productDir + '/' + nameArr[nameArr.length - 1]);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    await control.uploadFile(ctx, dir, name, path).then(res => {
        return200('上传图片成功', res, ctx)
    }).catch(err => {
        return500('上传图片失败', err, ctx)
    })
})

//删除产品图片
router.post('/delProductImg', async ctx => {
    let {
        productimg
    } = ctx.request.body
    if (productimg) {
        var nameArr = productimg.split('/')
        const filePath = Path.resolve('public/uploads/' + dirname.productDir + '/' + nameArr[nameArr.length - 1]);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    return200('删除图片成功', null, ctx)
})

//上传产品信息
router.post('/uploadProduct', async (ctx) => {
    let data = JSON.parse(ctx.request.body.data)
    data.time = dateTime()
    await Product.create(data).then(rel => {
        return200('新增成功', rel, ctx)
    }).catch(err => {
        return500('新增失败', err, ctx)
    })
})

//查询产品信息
router.post('/findProduct', async (ctx) => {
    let data = ctx.request.body
    if (data.findAll) {
        await Product.find().then(rel => {
            rel ? return200('产品列表查询成功', rel, ctx) : return500('产品列表查询失败', null, ctx)
        })
            .catch(err => {
                return500('产品列表查询失败', err, ctx)
            })
    } else {
        var match = {}
        if (data.input) {
            match[data.fuzz] = {
                $regex: data.input
            }
        }
        if(data.selectInput){
            match['type'] = {
                $regex: data.selectInput
            }
        }
        await Product.aggregate([{
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
                rel ? return200('产品列表查询成功', rel, ctx) : return500('产品列表查询失败', null, ctx)
            })
            .catch(err => {
                return500('产品列表查询失败', err, ctx)
            })
    }

})

//删除产品信息
router.post('/delateProduct', async (ctx) => {
    let data = ctx.request.body
    await Product.findOneAndDelete({
        _id: data._id
    }).then(rel => {
        if (rel) {
            return200('删除成功', rel, ctx)
        }
    })
})
//修改产品信息
router.post('/updataProduct', async (ctx) => {
    let data = JSON.parse(ctx.request.body.data)
    data.time = dateTime()
    await Product.findOneAndUpdate({
        _id: data._id
    }, data).then(rel => {
        if (rel) {
            return200('修改成功', rel, ctx)
        }
    })
})


//上传产品分类图标
router.post('/uploadIconlImg', KoaBody({
    multipart: true
}), async (ctx) => {
    var dir = dirname.iconlImgDir //定义上传目录
    let {
        name,
        path
    } = ctx.request.files.file
    await control.uploadFile(ctx, dir, name, path).then(res => {
        return200('上传图片成功', res, ctx)
    }).catch(err => {
        return500('上传图片失败', err, ctx)
    })
})
//删除产品分类图标
router.post('/delIconlImg', async ctx => {
    let {
        imgurl
    } = ctx.request.body
    if (imgurl) {
        var nameArr = imgurl.split('/')
        const filePath = Path.resolve('public/uploads/' + dirname.iconlImgDir + '/' + nameArr[nameArr.length - 1]);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    return200('删除图片成功', null, ctx)
})

//创建产品分类
router.post('/createProductClass', async (ctx) => {
    let data = ctx.request.body
    await productClass.create(data).then(rel => {
        return200('创建成功', rel, ctx)
    }).catch(err => {
        return500('创建失败', err, ctx)
    })
})

//查询产品分类
router.post('/findProductClass', async (ctx) => {
    // let data = ctx.request.body
    await productClass.find().then(rel => {
        return200('查询成功', rel, ctx)
    }).catch(err => {
        return500('查询失败', err, ctx)
    })
})

//删除产品分类
router.post('/delProductClass', async (ctx) => {
    let {
        _id
    } = ctx.request.body
    await productClass.findOneAndDelete({
        _id
    }).then(rel => {
        return200('删除成功', rel, ctx)
    }).catch(err => {
        return500('删除失败', err, ctx)
    })
})


/**************************************************> 招聘信息 <*******************************************************************/

//上传招聘信息
router.post('/uploadRecruiting', async (ctx) => {
    let data = ctx.request.body
    data.time = dateTime()
    await Recruiting.create(data).then(rel => {
        return200('新增成功', rel, ctx)
    }).catch(err => {
        return500('新增失败', err, ctx)
    })
})

//查询招聘信息
router.post('/findRecruiting', async (ctx) => {
    let data = ctx.request.body
    var match = {}
    // if(data.input){
    //   match[data.fuzz] = {$regex:data.input}
    // }
    await Recruiting.aggregate([{
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

//删除招聘信息
router.post('/delateRecruiting', async (ctx) => {
    let data = ctx.request.body
    await Recruiting.findOneAndDelete({
        _id: data._id
    }).then(rel => {
        if (rel) {
            return200('删除成功', rel, ctx)
        }
    })
})
//修改招聘信息
router.post('/updataRecruiting', async (ctx) => {
    let data = ctx.request.body
    data.time = dateTime()
    await Recruiting.findOneAndUpdate({
        _id: data._id
    }, data).then(rel => {
        if (rel) {
            return200('修改成功', rel, ctx)
        }
    })
})




module.exports = router
