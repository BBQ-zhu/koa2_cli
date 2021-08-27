const router = require('koa-router')()
const config = require('../config')
const KoaBody = require('koa-body') //解析接口请求的参数
const uploads = require('../controller/uploads')
router.prefix(config.api + '/uploads')

//上传员工图片(假上传)
router.post('/userImg',KoaBody({multipart: true}),uploads.userImg)
//上传员工图片(真上传)
router.post('/uploadImg',uploads.uploadImg)
//删除图片
router.post('/delateImg', uploads.delateImg)

//上传视频封面
router.post('/uploadVideoImg',KoaBody({multipart: true}),uploads.uploadVideoImg)
//删除视频封面
router.post('/delateVideoImg',uploads.delateVideoImg)
//上传视频
router.post('/uploadVideo',KoaBody({multipart: true}),uploads.uploadVideo)
//查询school视频
router.post('/findVideo',uploads.findVideo)
//删除school视频
router.post('/delateVideo',uploads.delateVideo)

//上传轮播图
router.post('/uploadScrollImg',KoaBody({multipart: true}),uploads.uploadScrollImg)
//查询轮播图
router.get('/findScrollImg',uploads.findScrollImg)
//删除轮播图
router.post('/delateScrollImg',uploads.delateScrollImg)





module.exports = router
