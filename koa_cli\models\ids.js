const mongoose = require('mongoose')

const userIds = new mongoose.Schema({
  name:{type:String,default:"ids"},
  uid:{type:Number,defalut:0}
})

const Ids = mongoose.model('ids',userIds)
mongoose.set("useFindAndModify",false)
module.exports = {
  Ids
}
