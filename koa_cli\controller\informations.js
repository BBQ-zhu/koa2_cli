const { informations } = require('../models/informations')
const {
  return200,
  return500
} = require('../config/error')

const findNews = async (ctx) => {
  let data = ctx.request.body
  var match = {}
  if(data.input){
    match[data.fuzz] = {$regex:data.input}
  }
  await informations.aggregate([
    { $match : match }, //用于过滤数据
    { $project : {
        __v : 0
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
    rel ? return200('新闻列表查询成功', rel, ctx) : return500('新闻列表查询失败', null, ctx)
  })
  .catch(err => {
    return500('新闻列表查询失败', err, ctx)
  })
}

const createNews = async (ctx) => {
  let data = {newsname,content,creators} = ctx.request.body
  data.time = new Date().toLocaleString()
  await informations.create(data).then(rel => {
    return200('新闻添加成功',rel,ctx)
  })
}

const updateNews = async (ctx) => {
  let data = {newsname,content} = ctx.request.body
  let {_id} = ctx.request.body
  console.log(data)
  await informations.findOneAndUpdate({_id},data).then(rel => {
    return200('新闻更新成功',rel,ctx)
  })
}

const deleteNews = async (ctx) => {
  let {_id} = ctx.request.body
  await informations.findOneAndDelete({_id}).then(rel => {
    return200('新闻删除成功',rel,ctx)
  })
}

module.exports = {
  findNews,
  createNews,
  updateNews,
  deleteNews
}
