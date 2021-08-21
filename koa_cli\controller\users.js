const model = require('../models/users')
const ids = require('../models/ids')
const contro = require('./index') //操作数据库的公共方法调用
const {
  return200,
  return500
} = require('../config/error')


const findUser = async ctx => {
  let data = ctx.request.body
  var match = {}
  if (data.input) {
    match[data.fuzz] = {
      $regex: data.input
    }
  }
  await model.User.aggregate([{
        $match: match
      }, //用于过滤数据
      {
        $project: {
          password: 0,
          __v: 0
        }
      },
      {
        "$facet": {
          "total": [{
            "$count": "total"
          }],
          "data": [{
              "$skip": Number(data.skip)
            },
            {
              "$limit": Number(data.limit)
            }
          ]
        }
      }
    ])
    .then(rel => {
      console.log(rel)
      rel ? return200('查询成功', rel, ctx) : return500('查询失败', null, ctx)
    })
    .catch(err => {
      return500('查询失败', err, ctx)
    })
}

const deleteUser = async ctx => {
  let data = {
    uid
  } = ctx.request.body
  await model.User.findOneAndDelete(data)
    .then(rel => {
      rel ? return200('删除成功', null, ctx) : return500('删除失败', null, ctx)
    })
    .catch(err => {
      return500('删除失败', err, ctx)
    })
}

const updateUser = async ctx => {
  let uid = ctx.request.body.uid
  let data = {
    username,
    password,
    role,
    phone
  } = ctx.request.body
  await model.User.updateOne({
      uid: uid
    }, data)
    .then(rel => {
      rel ? return200('更新成功', null, ctx) : return500('更新失败', null, ctx)
    })
    .catch(err => {
      return500('更新失败', err, ctx)
    })
}

const loginUser = async ctx => {
  ctx.verifyParams({ //校验参数
    uid: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  })

  let data = ctx.request.body
  await contro.AddNavMenu(model.User, data, ctx)
}

const updatePassword = async ctx => {
  ctx.verifyParams({ //校验参数
    uid: {
      type: 'string',
      required: true
    },
    oldPassword: {
      type: 'string',
      required: true
    },
    newPassword: {
      type: 'string',
      required: true
    }
  })

  let data = ctx.request.body
  let newData = {
    password: data.newPassword
  }
  await model.User.findOneAndUpdate({
    uid: data.uid,
    password: data.oldPassword
  }, newData).then(rel => {
    if (rel) {
      console.log(rel)
      return200('修改密码成功', null, ctx)
    }
  }).catch(err => {
    return500('修改密码失败', err, ctx)
  })
}

const createUser = async ctx => {
  verify(ctx) //校验参数
  let data = {
    username,
    password,
    imgurl,
    role,
    phone
  } = ctx.request.body
  data.time = new Date().toLocaleString()
  await ids.Ids.findOne({
    "name": "ids"
  }).then(async rel => { //获取唯一ID值作为员工工号
    if (rel) {
      await createDate(data, ctx)
    } else { //如果没有这个值就创建
      await ids.Ids.create({
        "name": "ids",
        "uid": 1
      }).then(async rel => {
        if (rel) {
          await createDate(data, ctx)
        } else {
          return500('新增失败', null, ctx)
        }
      }).catch(err => {
        return500('新增失败', err, ctx)
      })
    }
  })
}

//封装的创建用户方法
const createDate = async (data, ctx) => {
  await ids.Ids.findOneAndUpdate({
    "name": "ids"
  }, {
    $inc: {
      "uid": 1
    }
  }).then(async rel => {
    if (rel) {
      data.uid = formatZero(rel.uid, 5)
      await model.User.create(data)
        .then(rel => {
          rel ? return200('新增成功', null, ctx) : return500('新增失败', null, ctx)
        })
        .catch(err => {
          return500('新增失败', err, ctx)
        })
    } else {
      return500('新增失败', null, ctx)
    }
  }).catch(err => {
    return500('新增失败', err, ctx)
  })
}

//图形验证码
const getSvg = async (ctx) => {
  const cap = svgCaptcha.create({
    size: 4, // 验证码长度
    width: 160,
    height: 60,
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

  return200('svg验证码', img, ctx)
}
//校验参数
const verify = (ctx) => {
  ctx.verifyParams({
    username: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    role: {
      type: 'string',
      required: true
    }
  })
}

//员工账号 num（自增id）len(账号总长度)
const formatZero = (num, len) => {
  if (String(num).length > len) return num;
  return (Array(len).join(0) + num).slice(-len);
}

module.exports = {
  createUser,
  deleteUser,
  updateUser,
  findUser,
  loginUser,
  updatePassword,
  getSvg
}
