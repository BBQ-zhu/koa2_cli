const mongoose = require('mongoose')


//抵押客户表

const mortgageSchema = new mongoose.Schema({
    name: String,
    phone: String,
    type: String, //类型：默认抵押贷款
    monthmoney:String, //每月还款金额
    deposit:String, //保证金
    commission:String, //佣金比例
    loanamount:String, //放款金额
    loanterm:String, //贷款期限
    startime:String, //开始日期
    endtime:String, //结束日期
    manager1: String, //客户经理
    manager2: String, //金融客服
    fundchannel: String, //资金渠道
    mortgagee: String, //抵押权人
    status: String, //客户状态 已通知、已收款、待收款、逾期、已起诉
    optertime: String, //还款提示
    tipstime: String, //还款提示提前N天
    remarks:String, //备注详情
    time: String
})
const mortgages = mongoose.model('mortgages', mortgageSchema)

module.exports = {
  mortgages
}
