const mongoose = require('mongoose')

//轮播图表
const scroImgSchema = new mongoose.Schema({
  typeid:{type:String,default:''},
  scroimg:String
})

const scroimgs = mongoose.model('scroimgs',scroImgSchema)

module.exports = {
  scroimgs
}
