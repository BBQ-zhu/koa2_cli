const mongoose = require('mongoose')


//操作日志表

const logsSchema = new mongoose.Schema({
  // type: {type:String,default:'news'},
  user:String,
  logdata:String, //修改前数据
  remarks: String, //操作模块
  time: String
})
const logs = mongoose.model('logs', logsSchema)

module.exports = {
  logs
}
