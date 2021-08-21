const router = require('koa-router')()
const config = require('../config')
const roles = require('../controller/roles')
const {teams} = require('../models/teams')
const {
  return200,
  return500
} = require('../config/error')
router.prefix(config.api + '/roles')

//查询导航菜单列表
router.post('/findNavMenus', roles.findNavMenus) 

//添加角色
router.post('/addRole', roles.addRole) 
//删除角色
router.post('/delRole', roles.delRole) 
//修改角色
router.post('/updateRole', roles.updateRole) 
//查询角色
router.post('/findRole', roles.findRole) 
//查询单个角色
router.post('/findOneRole', roles.findOneRole) 

//添加团队
router.post('/addTeam', async (ctx)=>{
  let {teamname} = ctx.request.body
  await teams.findOne({teamname}).then(async rel=>{
    if(!rel){
      await teams.create({teamname}).then(res=>{
        return200('添加成功',res,ctx)
      })
    }else{
      return500('团队名称已存在',rel,ctx)
    }
  })
}) 
//删除团队
router.post('/delTeam', async (ctx)=>{
  let {_id} = ctx.request.body
  await teams.findOneAndDelete({_id}).then(rel=>{
    return200('删除成功',rel,ctx)
  })
}) 
//查询团队
router.get('/findTeam',async (ctx)=>{
  await teams.find().then(rel=>{
    return200('查询成功',rel,ctx)
  })
}) 

module.exports = router
