const Koa = require('koa')
const app = new Koa()
const session=require('koa-session') //koa使用session缓存
const Cors = require('koa2-cors') //跨域中间件
const json = require('koa-json') //格式化json
const logger = require('koa-logger') //日志输出
const jsonerror = require('koa-json-error') //返回统一的错误提示
const KoaBody = require('koa-body') //解析接口请求的参数
const parameter = require('koa-parameter') //校验请求的参数
const koajwt = require('koa-jwt'); //所有接口校验token
const config = require('./config')
const MongoConnect = require('./db')() //建立数据库连接


// 中间件对token进行验证 注意：放在路由前面
app.use(koajwt({ secret: config.SECRET }).unless({
  // 登录接口不需要验证
  path: [/^\/api\/user\/loginUser/,/^\/api\/user\/createUser/]   // 不需要做校验的接口在此处匹配  \/ 转译斜杠
}));

//设置session
app.keys = ['some secret hurr'];
const SessionConfig={
    key:'koa:sess',
    maxAge:60*1000*20,
    overwrite:true,
    httpOnly:true,
    signed:true,
    rolling:true,//每次访问将会重置过期时间
    renew:true
}
//启动session
app.use(session(SessionConfig,app))

//路由引入
const index = require('./routes/index')
const users = require('./routes/users')


// error 错误处理
app.use(Cors());
app.use(jsonerror())
app.use(KoaBody());
app.use(parameter(app))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// logger打印日志
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes 路由注册
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
