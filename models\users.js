const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    uid: String, //员工ID
    username: String, //名称
    password: {
        type: String,
        default: '123456'
    },
    role: {
        type: String,
        default: ''
    }, //角色
    team: {
        type: String,
        default: ''
    }, //团队
    phone: {
        type: String,
        default: ''
    }, //电话
    imgurl: {
        type: String,
        default: ''
    }, //角色
    idcard: String, //身份证
    address: String, //家庭住址
    isrecomed: {
        type: String,
        default: 'false'
    }, //是否推荐至咨询顾问
    intro: String, //顾问介绍
    seedata: String, //大数据查询
    remarks: String, //备注
    time: {
        type: String,
        default: ''
    },
})

const User = mongoose.model('users', userSchema)
module.exports = {
    User
}
