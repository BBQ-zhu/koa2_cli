/**
 * 封装操作数据库的方法
 */
const {
  return200,
  return500
} = require('../config/error')
const jsonwebtoken = require('jsonwebtoken'); //加密生成token
const config = require('../config')
const {
  navMenu
} = require('../models/navMenus')
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
    name: '首页',
    id: 1,
    icon: 'el-icon-menu',
    show: false,
    component: '',
    redirect: '',
    children: [{
      path: '/Agents',
      name: '代办中心',
      id: 2,
      icon: 'el-icon-bell',
      show: false,
      meth:['查询'],
      component: ''
    }]
  },
  {
    path: '/Home',
    name: '前端管理',
    id: 3,
    icon: 'el-icon-s-data',
    show: false,
    component: '',
    redirect: '',
    children: [{
        path: '/ScroImage',
        name: '轮播图片',
        id: 4,
        icon: 'el-icon-picture',
        show: false,
        meth:['查询'],
        component: ''
      },
      {
        path: '/WebControl',
        name: '新闻管理',
        id: 5,
        icon: 'el-icon-notebook-2',
        show: false,
        meth:['查询'],
        component: ''
      },
      {
        path: '/Product',
        name: '产品管理',
        id: 6,
        icon: 'el-icon-s-shop',
        show: false,
        meth:['查询'],
        component: ''
      },
      {
        path: '/EntrSchool',
        name: '创业学堂',
        id: 7,
        icon: 'el-icon-s-platform',
        show: false,
        meth:['查询'],
        component: ''
      },
      {
        path: '/Recruiting',
        name: '招聘专区',
        id: 8,
        icon: 'el-icon-files',
        show: false,
        meth:['查询'],
        component: ''
      }
    ]
  },
  {
    path: '/Home',
    name: '业务中心',
    id: 9,
    icon: 'el-icon-s-grid',
    show: false,
    component: '',
    redirect: '',
    children: [
      {
        path: '/Integrate',
        name: '综合服务',
        id: 11,
        icon: 'el-icon-coin',
        show: false,
        meth:['查询'],
        component: ''
      }
    ]
  },
  {
    path: '/Home',
    name: '资料中心',
    id: 12,
    icon: 'el-icon-edit-outline',
    show: false,
    component: '',
    redirect: '',
    children: [{
        path: '/Contract',
        name: '合同中心',
        id: 13,
        icon: 'el-icon-folder-opened',
        show: false,
        meth:['查询'],
        component: ''
      },
      {
        path: '/Customer',
        name: '贷款资料',
        id: 14,
        icon: 'el-icon-user',
        show: false,
        meth:['查询'],
        component: ''
      },
      {
        path: '/Enterprise',
        name: '企业资料',
        id: 15,
        icon: 'el-icon-user',
        show: false,
        meth:['查询'],
        component: ''
      }
    ]
  },
  {
    path: '/Home',
    name: '权限管控',
    id: 16,
    icon: 'el-icon-setting',
    show: false,
    component: '',
    redirect: '',
    children: [
      {
        path: '/Client',
        name: '客户管理',
        id: 17,
        icon: 'el-icon-user-solid',
        show: false,
        meth:['查询'],
        component: ''
      },
      {
        path: '/Works',
        name: '员工管理',
        id: 18,
        icon: 'el-icon-user-solid',
        show: false,
        meth:['查询'],
        component: ''
      },
      {
        path: '/Roles',
        name: '身份管理',
        id: 19,
        icon: 'el-icon-s-flag',
        show: false,
        meth:['查询'],
        component: ''
      }
    ]
  },
  {
    path: '/Home',
    name: '系统中心',
    id: 20,
    icon: 'el-icon-s-help',
    show: false,
    component: '',
    redirect: '',
    children: [{
        path: '/Operation',
        name: '操作记录',
        id: 21,
        icon: 'el-icon-view',
        show: false,
        meth:['查询'],
        component: ''
      }
    ]
  }
]

//校验导航菜单是否已存在数据库，然后再登录
const AddNavMenu = async (model, data, ctx) => {
  var newList = {
    "navMenuList": navMenuList
  }
  await navMenu.findOneAndReplace({
    "name": "navMenu"
  }, newList).then(async rel => {
    if (rel) {
      await login(model, data, ctx)
    } else {
      await navMenu.create({
        "name": "navMenu",
        "navMenuList": navMenuList
      }).then(async rel => {
        if (rel) {
          await login(model, data, ctx)
        } else {
          return500("创建导航菜单失败", null, ctx)
        }
      }).catch(err => {
        return500("创建导航菜单失败", err, ctx)
      })
    }
  }).catch(err => {
    return500("创建导航菜单失败", err, ctx)
  })
}

module.exports = {
  AddNavMenu,
  login,
  uploadFile
}
