const mongoose = require('mongoose')

//内部资料表
const internalSchema = new mongoose.Schema({
  type:String,
  newsname: String,
  message: String,
  content: String,
  time: String
})
const internal = mongoose.model('internals', internalSchema)

module.exports = {
  internal
}
