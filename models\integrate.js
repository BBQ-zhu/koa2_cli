const mongoose = require('mongoose')


//综合服务表

const integrateSchema = new mongoose.Schema({
    type: String,
    proname: String,
    name: String,
    phone: String,
    manager1: String, //客户经理
    manager2: String, //金融客服
    hires: String, //职业类型
    social: String, //社保情况
    provident: String, //公积金情况
    houses: String, //房屋情况
    car: String, //车辆情况
    policy: String, //保险情况
    sesame: String, //芝麻分
    microcredit: String, //微粒贷
    credit: String, //信用卡
    tobacco: String, //是否有烟草证
    comtype: String, //企业客户类型 公司注册、代理记账、商标资质、其他服务
    othercomtype: String, //其他服务补充
    feedback: String, //审批反馈
    vipstatus: String, //客户状态 新客户、正在跟进、邀约上面、上门签单、放款成功、拒绝客户、放弃客户
    status: String, //审核状态 
    schedate: Number, //审核时间
    remarks: String,
    time: String
})
const integrate = mongoose.model('integrates', integrateSchema)

module.exports = {
    integrate
}
