const mongoose = require('mongoose')

//合同表
const contractSchema = new mongoose.Schema({
    type: {
        type: String,
        default: '其它'
    },
    conname: String, //合同名称
    name: String, //客户名称
    phone: String, //电话
    imgurl: String, //合同图片
    expenses: String, //放款金额
    mode: String, //收费方式:比例收费、直接收费
    ratio: String, //抽成比例
    service: String, //服务费用
    loantype:String, //贷款类型：抵押贷款，信用贷款
    collateral:String, //抵押物、申请物
    margin:String, //委托服务保证金
    manner: String, //付款方式
    status: String, //合同状态 待签约 审核中 （驳回 签约成功）
    remarks: String, //备注
    startime: String, //起始时间
    endtime: String, //结束时间
    manager1: String, //客户经理
    manager2: String, //权证经理
    manager3: String, //审核经理
    optertime: {
        type: String,
        default: '不提示'
    }, //提示方式
    tipstime: {
        type: String,
        default: '7'
    }, //提前几天提示
    time: String,
})
const contract = mongoose.model('contracts', contractSchema)

module.exports = {
    contract
}
