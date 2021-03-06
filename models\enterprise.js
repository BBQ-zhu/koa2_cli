const mongoose = require('mongoose')


//企业资料 
const enterpriseSchema = new mongoose.Schema({
    type: {
        type: String,
        default: ''
    }, //代理记账、企业注册
    entername: {
        type: String,
        default: ''
    }, //企业名称
    name: String, //负责人姓名
    phone: String, //负责人电话
    idcard: String, //负责人身份证号码
    gener: String, //法人
    zone: {
        type: String,
        default: ''
    }, //区域
    fund: String, //注册资金
    super: String, //公司监事
    main: String, //主营项目
    scope: String, //经营范围
    accout: String, //天府通账号
    hometeam: String, //归属团队
    manager1: String, //客户经理
    manager2: String, //金融客服
    manager3: String, //代办客服
    status: String, //审核状态
    feedback: String, //反馈消息
    remarks: String, //备注
    schedate: Number, //审核时间
    time: {
        type: String,
        default: ''
    }
})
const enterprise = mongoose.model('enterprise', enterpriseSchema)

module.exports = {
    enterprise
}
