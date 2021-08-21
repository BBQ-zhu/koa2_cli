const mongoose = require('mongoose')

//角色表
const rolesSchema = new mongoose.Schema({
  rolename:{type:String,default:''},
  roleList:{type:Array,default:[]}
})

const roles = mongoose.model('roles',rolesSchema)

module.exports = {
  roles
}
