const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    uid:String,
    username:String,
    password:String,
    phone:{type:String,default: ''}
})

const User = mongoose.model('users',userSchema)
module.exports = {
  User
}
