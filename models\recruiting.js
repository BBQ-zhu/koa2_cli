const mongoose = require('mongoose')

//招聘专区表
const RecruitingSchema = new mongoose.Schema({
    name:String, //岗位
    salary:String, //薪资
    address:String, //地址
    education:String, //学历
    details:String, //详情
    time:{type:String,default:''}
})
const Recruiting = mongoose.model('recruitings',RecruitingSchema)

module.exports = {
  Recruiting
}
