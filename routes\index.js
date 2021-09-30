/**
 * 公共接口文件
 */
const router = require('koa-router')()
const config = require('../config')
const jsonwebtoken = require('jsonwebtoken'); //加密生成token
const {return200,return500} = require('../config/error')
router.prefix(config.api)
// 直接写路由
// 然后修改 web 端的 ueditor.config.js 配置 serverUrl 为对应路由地址
// serverUrl: "/editor/controller"
const ueditor = require('koa2-ueditor')

// 需要传一个数组：静态目录和 UEditor 配置对象
// 比如要修改上传图片的类型、保存路径  
// router.all('/editor/controller', ueditor('public'))
//imageUrlPrefix配置图片访问前缀，且要放过token检查
router.all('/editor/controller', ueditor(['public', {
   // "imageUrlPrefix":"http://localhost:3030",
	"imageAllowFiles": [".png", ".jpg", ".jpeg",".PNG",".JPG"],
	"imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{time}{rand:6}"  // 保存为原文件名
}]))

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
