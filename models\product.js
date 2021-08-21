const mongoose = require('mongoose')

//产品表
const productSchema = new mongoose.Schema({
    type:{type:String,default:'all'},
    recommend:{type:String,default:'0'}, //不推荐 推荐
    name:String,
    description:String,
    newprice:String,
    oldprice:String,
    productimg:String,
    details:String,
    time:{type:String,default:''}
})
const Product = mongoose.model('products',productSchema)

//产品分类表
const classSchema = new mongoose.Schema({
  type:String,
  typeid:String
})
const productClass = mongoose.model('productclass',classSchema)


module.exports = {
  Product,
  productClass
}
