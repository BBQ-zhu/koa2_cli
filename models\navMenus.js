const mongoose = require('mongoose')

//菜单导航表
const navMenuSchema = new mongoose.Schema({
    name:{type:String,default:'navMenu'},
    navMenuList:{type:Array,default:[]}
})
const navMenu = mongoose.model('navMenus',navMenuSchema)

module.exports = {
  navMenu
}
