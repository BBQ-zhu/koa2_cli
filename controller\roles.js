
const {roles} = require('../models/roles')
const {navMenu} = require('../models/navMenus')
const {
  return200,
  return500
} = require('../config/error')

const findNavMenus = async ctx=>{
  await navMenu.findOne({"name":"navMenu"}).then(rel=>{
    if(rel){
      return200('查询列表成功',rel.navMenuList,ctx)
    }else{
      return500('查询列表失败',null,ctx)
    }
  }).catch(err=>{
    return500('查询列表失败',err,ctx)
  })
}

const addRole = async ctx=>{
  let data = ctx.request.body
  await roles.create(data).then(rel=>{
    if(rel){
      return200('创建角色成功',null,ctx)
    }else{
      return500('创建角色失败',null,ctx)
    }
  }).catch(err=>{
    return500('创建角色失败',err,ctx)
  })
}

const delRole = async ctx=>{
  let data = ctx.request.body
  await roles.deleteOne(data).then(rel=>{
    if(rel){
      return200('删除角色成功',null,ctx)
    }else{
      return500('删除角色失败',null,ctx)
    }
  }).catch(err=>{
    return500('删除角色失败',err,ctx)
  })
}

const updateRole = async ctx=>{
  let data = ctx.request.body
  await roles.findByIdAndUpdate({_id:data._id},{roleList:data.roleList,navList:data.navList}).then(rel=>{
    if(rel){
      return200('更新角色成功',null,ctx)
    }else{
      return500('更新角色失败',null,ctx)
    }
  }).catch(err=>{
    return500('更新角色失败',err,ctx)
  })
}

const findRole = async ctx=>{
  let data = ctx.request.body
  await roles.find(data).then(rel=>{
    if(rel){
      return200('查询角色成功',rel,ctx)
    }else{
      return500('查询角色失败',null,ctx)
    }
  }).catch(err=>{
    return500('查询角色失败',err,ctx)
  })
}

const findOneRole = async ctx=>{
  let data = ctx.request.body
  await roles.findOne(data).then(rel=>{
    if(rel){
      return200('查询角色成功',rel,ctx)
    }else{
      return500('查询角色失败',null,ctx)
    }
  }).catch(err=>{
    return500('查询角色失败',err,ctx)
  })
}

module.exports = {
  findNavMenus,
  addRole,
  delRole,
  updateRole,
  findRole,
  findOneRole
}
