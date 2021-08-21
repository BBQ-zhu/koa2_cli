const mongoose = require('mongoose')


//新闻管理
const informationSchema = new mongoose.Schema({
  type:{type:String,default:'news'},
  creators:{type:String,default:''},
  newsname: String,
  content:String,
  time:{type:String,default:''},
})
const informations = mongoose.model('informations', informationSchema)

module.exports = {
  informations
}
