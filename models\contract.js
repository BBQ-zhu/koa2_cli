const mongoose = require('mongoose')

//合同表
const contractSchema = new mongoose.Schema({
    type: {type: String,default: '其它'},
    conname:String, //合同名称
    name: String, //客户名称
    phone: String, //电话
    imgurl:String, //合同图片
    expenses:String, //费用
    manner:String, //付款方式
    status:String, //合同状态
    remarks:String, //备注
    time: String, 
})
const contract = mongoose.model('contracts', contractSchema)

module.exports = {
  contract
}
