const mongoose = require('mongoose')
const {mongoUrl} = require('../config')

module.exports = ()=>{
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true     
  }).then(() => {
    console.log('mongodb 数据库连接成功!')
  }).catch((err)=>{
    console.log('mongodb 数据库连接失败!',err)
  })
}
