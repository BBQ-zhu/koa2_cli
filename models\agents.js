const mongoose = require('mongoose')

//代办表
const agentSchema = new mongoose.Schema({
    proid:String, //产品id
    type: {type: String,default: '其它'}, //数据来源
    name: String, //客户名称
    phone: String, //电话
    submitby:String, //提交人
    handler:String, //处理人
    path:String, //跳转路径
    read:String, //是否已处理
    time: String
})
const agents = mongoose.model('agents', agentSchema)

module.exports = {
  agents
}
