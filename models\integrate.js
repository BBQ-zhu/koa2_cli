const mongoose = require('mongoose')


//综合服务表

const integrateSchema = new mongoose.Schema({
  type: String,
  proname:String,
  name: String,
  phone: String,
  remarks: String,
  time: String
})
const integrate = mongoose.model('integrates', integrateSchema)

module.exports = {
  integrate
}
