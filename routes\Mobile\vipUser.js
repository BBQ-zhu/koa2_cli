const router = require('koa-router')()
const config = require('../../config')
const jsonwebtoken = require('jsonwebtoken'); //加密生成token
const {
    vipuser
} = require('../../models/Mobile/vipUser')
router.prefix(config.api + '/vipuser')
const {
    return200,
    return500
} = require('../../config/error')
const {
    MessageClient,
} = require('../../config/alicloud');

//新增vip用户
router.post('/createVipuser', async ctx => {
    let data = ctx.request.body
    data.time = `${new Date().getFullYear()}/${new Date().getMonth()+1}/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    await vipuser.create(data).then(rel => {
        return200('新增成功', rel, ctx)
    }).catch(err => {
        return500('新增失败', err, ctx)
    })
})

//查询vip用户
router.post('/findVipuser', async ctx => {
    let data = ctx.request.body
    var match = {}
    if (data.input) {
        match[data.fuzz] = {
            $regex: data.input
        }
    }
    await vipuser.aggregate([{
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
            rel ? return200('查询成功', rel, ctx) : return500('查询失败', null, ctx)
        })
        .catch(err => {
            return500('查询失败', err, ctx)
        })
})

//更新vip用户
router.post('/updateVipuser', async ctx => {
    let data = ctx.request.body
    await vipuser.findOneAndUpdate({
        _id: data._id
    }, data).then(rel => {
        if (rel) {
            return200('修改成功', rel, ctx)
        }
    })
})

//删除vip用户
router.post('/deleteVipuser', async ctx => {
    let data = ctx.request.body
    await vipuser.findOneAndDelete({
        _id: data._id
    }).then(rel => {
        if (rel) {
            return200('删除成功', rel, ctx)
        }
    })
})

//登录vip用户
router.post('/loginVipuser', async ctx => {
    let {
        phone
    } = ctx.request.body
    await vipuser.findOne({
            phone
        }, {
            __v: 0
        })
        .then(rel => {
            if (rel) {
                let token = jsonwebtoken.sign({
                        name: rel.username,
                        id: rel.phone
                    }, // 加密userToken
                    config.SECRET, {
                        expiresIn: config.tokenTime
                    } //失效时间以秒为单位 
                )
                let arr = JSON.parse(JSON.stringify(rel))
                arr.token = token
                return200('登录成功', arr, ctx)
            } else {
                return500('登录失败', null, ctx)
            }
        })
        .catch(err => {
            return500('登录失败', err, ctx)
        })
})

//获取验证码
router.post('/getCodeVipuser', async ctx => {
    let {
        phone
    } = ctx.request.body
    let code = await generateMessageCode()

    return200('获取验证码成功', code, ctx) // 本地验证

    // let messageClient = new MessageClient(phone, code) //有效校验，记得恢复
    // const res = await messageClient.send()
    // if (res.Message === 'OK' && res.Code === 'OK') {
    //     return200('获取验证码成功', code, ctx)
    // } else {
    //     return500('获取验证码失败', '', ctx)
    // }
})

//检查验证码
router.post('/checkCodeVipuser', async ctx => {
    // let {code} = ctx.request.body
    // if(Code.checkCode(code)){
    //   return200('验证码正确', '', ctx)
    // }else{
    //   return500('验证码有误', '', ctx)
    // }
    // await vipuser.find({
    //   _id: _id
    // }).then(rel => {
    //   if (rel.code == code) {
    //     return200('验证码正确', '', ctx)
    //   }else{
    //     return500('验证码有误', '', ctx)
    //   }
    // })
})

/**
 * 生成四位随机的手机验证码
 * @returns 
 */
function generateMessageCode() {
    let num = "";
    for (let i = 0; i < 4; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num
}

module.exports = router
