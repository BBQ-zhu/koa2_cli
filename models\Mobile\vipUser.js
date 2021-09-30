const mongoose = require('mongoose')

//会员用户表
const vipUserSchema = new mongoose.Schema({
  username:String,
  phone:{type:String,default: ''},
  code:String,
  time:{type:String,default: ''}
})
const vipuser = mongoose.model('vipusers', vipUserSchema)

module.exports = {
  vipuser
}
