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

//手机上传合同文档
router.post('/uploadPhoneContractImg', KoaBody({
    multipart: true
}), async (ctx) => {
    var {
        oldimgurl,
        newimgurl
    } = ctx.request.body
    const fileDir = `${__dirname}/../public/uploads/${dirname.contractDir}`;
    if (!fs.existsSync(fileDir)) { //如果没有这个文件夹就创建一个
        fs.mkdirSync(fileDir);
    } 
    var path = 'public/uploads/' + dirname.contractDir + '/' + Date.now() + '.png';
    var base64 = newimgurl.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
    var dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对象
    fs.writeFileSync(path, dataBuffer, (err) => { //用fs写入文件
        if (!err) {
            //   console.log('base64写入失败')
        } else {
            //   console.log('base64写入成功')
        }
    })
    if (oldimgurl) {
        var nameArr = oldimgurl.split('/')
        const filePath = Path.resolve('public/uploads/' + dirname.contractDir + '/' + nameArr[nameArr.length - 1]);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
    var FileName_dir = ctx.origin + path.replace('public', '')
    return200('上传图片成功', FileName_dir, ctx)
})

//后台上传合同文档
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
            fs.unlinkSync(filePath)
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
    }
    return200('删除图片成功', null, ctx)
})

//上传合同信息
router.post('/uploadContract', async (ctx) => {
    let data = ctx.request.body
    data.time = new Date().toLocaleDateString() +' '+ new Date().toLocaleTimeString().slice(2)
    await contract.create(data).then(rel => {
        return200('新增成功', rel, ctx)
    }).catch(err => {
        return500('新增失败', err, ctx)
    })
})

//查询合同信息
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
            rel ? return200('合同列表查询成功', rel, ctx) : return500('合同列表查询失败', null, ctx)
        })
        .catch(err => {
            return500('合同列表查询失败', err, ctx)
        })
})

//删除合同信息
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
//修改合同信息
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

//查询单个合同信息
router.post('/findOneContract', async (ctx) => {
    let data = ctx.request.body
    await contract.find({
        _id: data._id
    }).then(rel => {
        if (rel) {
            return200('查询成功', rel, ctx)
        }
    })
})

module.exports = router
