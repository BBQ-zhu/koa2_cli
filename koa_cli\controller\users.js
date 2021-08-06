const model = require('../models/users')
const ids = require('../models/ids')
const contro = require('./index') //操作数据库的公共方法调用
const svgCaptcha = require('svg-captcha') //生成图形验证码
const {return200,return500} = require('../config/error')

const findUser = async ctx => {
  let data = ctx.request.body
  await contro.find(model.User, data, ctx)
}

const deleteUser = async ctx => {
  let data = {
    _id
  } = ctx.request.body
  await contro.del(model.User, data, ctx)
}

const updateUser = async ctx => {
  let id = ctx.request.body._id
  let data = {
    username,
    password,
    phone
  } = ctx.request.body
  await contro.update(model.User, id, data, ctx)
}

const loginUser = async ctx => {
  console.log(ctx)
  ctx.verifyParams({ //校验参数
    uid:{
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  })
  
  let data = ctx.request.body
  console.log(data)
  await contro.login(model.User, data, ctx)
}

const createUser =  async ctx => {
  verify(ctx) //校验参数
  let data = {
    username,
    password,
    phone
  } = ctx.request.body
  await ids.Ids.findOne({"name":"ids"}).then(async rel=>{ //获取唯一ID值作为员工工号
    if(rel){
      await createDate(data,ctx)
    }else{//如果没有这个值就创建
      await ids.Ids.create({"name":"ids","uid":1}).then(async rel=>{ 
        if(rel){
          await createDate(data,ctx)
        }else{
          return500('新增失败',null,ctx)
        }
      }).catch(err=>{
        return500('新增失败',err,ctx)
      })
    }
  })
}

//封装的创建用户方法
const createDate = async (data,ctx)=>{
  await ids.Ids.findOneAndUpdate({"name":"ids"},{$inc:{"uid":1}}).then(async rel=>{
    if(rel){
      data.uid = formatZero(rel.uid,5) 
      await contro.create(model.User, data, ctx)
    }else{
      return500('新增失败',null,ctx)
    }
  }).catch(err=>{
    return500('新增失败',err,ctx)
  })
}
const getSvg = async (ctx)=>{
  const cap = svgCaptcha.create({
    size: 4, // 验证码长度
    width:160,
    height:60,
    fontSize: 50,
    ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
    noise: 2, // 干扰线条的数量
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    background: '#eee' // 验证码图片背景颜色
  })
  let img = cap.data // 验证码
  let text = cap.text.toLowerCase() // 验证码字符，忽略大小写
  // 设置响应头
  // ctx.response.type = 'image/svg+xml';
 
  return200('svg验证码',img,ctx)
}

const verify = (ctx) => {
  ctx.verifyParams({ //校验参数
    username: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    phone: {
      type: 'string',
      required: true
    }
  })
}


//员工账号 num（自增id）len(账号总长度)
const formatZero = (num, len) => {
  if(String(num).length > len) return num;
  return (Array(len).join(0) + num).slice(-len);
}

module.exports = {
  createUser,
  deleteUser,
  updateUser,
  findUser,
  loginUser,
  getSvg
}
