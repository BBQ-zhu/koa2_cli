/**
 * 封装操作数据库的方法
 */
const {
  return200,
  return500
} = require('../config/error')
const jsonwebtoken = require('jsonwebtoken'); //加密生成token
const config = require('../config')

const create = (model, data, ctx) => (
  model.create(data)
  .then(rel => {
    rel ? return200('新增成功', null, ctx) : return500('新增失败', null, ctx)
  })
  .catch(err => {
    return500('新增失败', err, ctx)
  })
)

const del = (model, data, ctx) => (
  model.findOneAndDelete(data)
  .then(rel => {
    rel ? return200('删除成功', null, ctx) : return500('删除失败', null, ctx)
  })
  .catch(err => {
    return500('删除失败', err, ctx)
  })
)

const update = (model, id, data, ctx) => (
  model.updateOne(id, data)
  .then(rel => {
    console.log(rel)
    rel ? return200('更新成功', null, ctx) : return500('更新失败', null, ctx)
  })
  .catch(err => {
    return500('更新失败', err, ctx)
  })
)

const find = (model, data, ctx) => (
  model.find(data)
  .then(rel => {
    rel ? return200('查询成功', rel, ctx) : return500('查询失败', null, ctx)
  })
  .catch(err => {
    return500('查询失败', err, ctx)
  })
)

const login = (model, data, ctx) => (
  model.findOne(data, {
    password: 0,
    _id: 0,
    __v: 0
  })
  .then(rel => {
    console.log(rel)
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



module.exports = {
  create,
  del,
  update,
  find,
  login
}
