const router = require('koa-router')()
const config = require('../config')
const informations = require('../controller/informations')
router.prefix(config.api + '/informations')

//查询信息列表
router.post('/findNews', informations.findNews) 
//新建新闻信息
router.post('/createNews', informations.createNews) 
//更新新闻信息
router.post('/updateNews', informations.updateNews) 
//删除新闻信息
router.post('/deleteNews', informations.deleteNews) 



module.exports = router
