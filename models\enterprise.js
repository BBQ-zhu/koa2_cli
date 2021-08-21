const mongoose = require('mongoose')


//企业资料
const enterpriseSchema = new mongoose.Schema({
  type:{type:String,default:''}, //代理记账、企业注册
  entername:{type:String,default:''}, //企业名称
  name:String, //负责人姓名
  phone:String, //负责人电话
  gener:String, //法人
  zone:{type:String,default:''}, //区域
  fund: String, //注册资金
  super:String, //公司监事
  main:String, //主营项目
  scope:String, //经营范围
  accout:String, //天府通账号
  remarks:String, //备注
  time:{type:String,default:''}
})
const enterprise = mongoose.model('enterprise', enterpriseSchema)

module.exports = {
  enterprise
}
