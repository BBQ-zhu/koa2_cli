const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    uid:String,
    username:String,
    password:{type:String,default: '123456'},
    role:{type:String,default: ''},
    team:{type:String,default: ''},
    phone:{type:String,default: ''},
    imgurl:{type:String,default: ''},
    time:{type:String,default: ''},
})

const User = mongoose.model('users',userSchema)
module.exports = {
  User
}
