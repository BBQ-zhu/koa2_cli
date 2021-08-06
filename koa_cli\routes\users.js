const router = require('koa-router')()
const config = require('../config')
const userCon = require('../controller/users')
router.prefix(config.api + '/user')

//jwt登录
router.post('/loginUser', userCon.loginUser) 
//获取图形验证码
router.get('/getSvg', userCon.getSvg) 
//查询用户
router.post('/findUser', userCon.findUser) 
//删除用户
router.post('/deleteUser', userCon.deleteUser) 
//修改用户
router.post('/updateUser', userCon.updateUser) 
//新增用户
router.post('/createUser', userCon.createUser)


module.exports = router
