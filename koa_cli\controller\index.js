/**
 * 封装操作数据库的方法
 */
const {
  return200,
  return500
} = require('../config/error')
const jsonwebtoken = require('jsonwebtoken'); //加密生成token
const config = require('../config')
const {navMenu} = require('../models/navMenus')
const fs = require('fs')
const path = require('path')


//上传文件公共方法
const uploadFile = (ctx, dir, name, path) => {
  return new Promise(function (resolve, reject) {
    // 创建文件输入流
    const fileReader = fs.createReadStream(path);
    // 文件将要的存放文件夹路径
    const fileDir = `${__dirname}/../public/uploads/${dir}`;
    // 判断目录是否存在,目录不存在则创建
    if (!fs.existsSync(fileDir)) {
      try {
        fs.mkdirSync(fileDir);
      } catch (e) {
        reject(e)
      }
    }
    // 保存文件的最终路径 (文件夹路径+文件名)
    // localhost:3000/uploads/xxx.png
    var FileName = `${name.split('.')[0]}-${Date.now()}.${name.split('.')[1]}` //时间戳
    var FileName_dir = `${ctx.origin}/uploads/${dir}/${FileName}`; //ctx.origin上下文地址：http://localhost:3030
    const filepath = `${fileDir}/${FileName}`;
    // 创建文件输出流
    const fileWriter = fs.createWriteStream(filepath);
    // 写入文件数据
    fileReader.pipe(fileWriter);
    resolve(FileName_dir)
  })
}


const login = (model, data, ctx) => (
  model.findOne(data, {
    password: 0,
    __v: 0
  })
  .then(rel => {
    if (rel) {
      let token = jsonwebtoken.sign({
          name: rel.username,
          id: rel.uid
        }, // 加密userToken
        config.SECRET, {
          expiresIn: config.tokenTime
        } //失效时间以秒为单位 
      )
      let arr = JSON.parse(JSON.stringify(rel))
      arr.token = token
      return200('登录成功', arr, ctx)
    } else {
      return500('登录失败', null, ctx)
    }
  })
  .catch(err => {
    return500('登录失败', err, ctx)
  })
)

// 菜单导航
let navMenuList = [
  {
    path: '/Home',
    name:'网站管理',
    id:1,
    icon:'el-icon-location',
    show: false,
    component: '',
    redirect: '',
    children:[
      {
        path: '/WebControl',
        name:'网站管理',
        id:2,
        icon:'el-icon-location',
        show: false,
        component: ''
      },
      {
        path: '/VipUser',
        name:'会员用户',
        id:3,
        icon:'el-icon-location',
        show: false,
        component: ''
      },
      {
        path: '/EntrSchool',
        name:'创业者学堂',
        id:7,
        icon:'el-icon-location',
        show: false,
        component: ''
      },
    ]
  },
  {
    path: '/Home',
    name:'权限管控',
    id:4,
    icon:'el-icon-location',
    show: false,
    component: 'Home',
    redirect: '',
    children:[
      {
        path: '/Works',
        name:'员工管理',
        id:5,
        icon:'el-icon-location',
        show: false,
        component: 'Works'
      },
      {
        path: '/Roles',
        name:'角色管理',
        id:6,
        icon:'el-icon-location',
        show: false,
        component: 'Roles'
      }
    ]
  }
]

//校验导航菜单是否已存在数据库，然后再登录
const AddNavMenu = async (model, data,ctx)=>{
  var newList = {
    "navMenuList":navMenuList
  }
  await navMenu.findOneAndReplace({"name":"navMenu"},newList).then(async rel=>{
    if(rel){
      await login(model, data, ctx)
    }else{
      await navMenu.create({
        "name": "navMenu",
        "navMenuList": navMenuList
      }).then(async rel=>{
        if(rel){
          await login(model, data, ctx)
        }else{return500("创建导航菜单失败",null,ctx)}
      }).catch(err=>{
        return500("创建导航菜单失败",err,ctx)
      })
    }
  }).catch(err=>{
    console.log(err)
    return500("创建导航菜单失败",err,ctx)
  })
}

module.exports = {
  AddNavMenu,
  login,
  uploadFile
}
