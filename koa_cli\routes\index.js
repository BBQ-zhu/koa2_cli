/**
 * 公共接口文件
 */
const router = require('koa-router')()
const config = require('../config')
const jsonwebtoken = require('jsonwebtoken'); //加密生成token
const {return200,return500} = require('../config/error')
router.prefix(config.api)

router.get('/', async (ctx, next) => {
   ctx.body = '欢迎!!!' // ctx.query
})

router.post('/checkToken', async (ctx) => {
   // 中间件统一验证token
   let token = ctx.header.authorization;
   let payload = jsonwebtoken.verify(token.split(' ')[1], config.SECRET)
   payload ? return200('token已认证',null,ctx) : return500('token已失效',null,ctx)
})


module.exports = router
