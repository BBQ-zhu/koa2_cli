const mongoose = require('mongoose')

//产品表
const productSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'all'
    },
    recommend: {
        type: String,
        default: '不推荐'
    }, //不推荐 推荐
    name: String,
    description: String, //描述
    newprice: String,
    oldprice: String,
    volume: String, //销量
    productlogo: String,
    productimg: String,
    consulting: String, //总计咨询
    totalales: String, //总计销量
    totalview: String, //总计浏览
    details: String,
    time: String
})
const Product = mongoose.model('products', productSchema)

//产品分类表
const classSchema = new mongoose.Schema({
    name: {
        type: String,
        default: '默认名称'
    }, //导航名称
    number: {
        type: String,
        default: '0'
    }, //导航顺序
    super: {
        type: String,
        default: '否'
    }, //是否推荐至首页
    imgurl: {
        type: String,
        default: ''
    }, //导航图标
    remaks:String
})
const productClass = mongoose.model('productclass', classSchema)


module.exports = {
    Product,
    productClass
}
