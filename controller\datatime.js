const { agents } = require('../models/agents')
const { contract } = require('../models/contract')
const { customer } = require('../models/customer')
const { enterprise } = require('../models/enterprise')
const { informations } = require('../models/informations')
const { integrate } = require('../models/integrate')
const { internal } = require('../models/internal')
const { logs } = require('../models/logs')
const { mortgages } = require('../models/mortgages')
const { Product } = require('../models/product')
const { Recruiting } = require('../models/recruiting')
const { statistics } = require('../models/statistic')
const { User } = require('../models/users')
const { Video } = require('../models/videos')
const { vipuser } = require('../models/Mobile/vipUser')


const datas = async () => {
  // await datatime(agents);
  // await datatime(contract);
  // await datatime(customer);
  // await datatime(enterprise);
  await datatime(informations);
  // await datatime(integrate);
  // await datatime(internal);
  // await datatime(logs);
  // await datatime(mortgages);
  // await datatime(Product);
  // await datatime(Recruiting);
  // await datatime(statistics);
  // await datatime(User);
  // await datatime(Video);
  // await datatime(vipuser);

}
const datatime = async (model) => {
  if (model) {
    await model.find().then(res => {
      if (res) {
        res.map(async item=>{
          if(item.time){
            let date = item.time.split(' ')
            let left = (date[0] || '2021/12/24').split('/')
            if(left.length<=1){
              left = date[0].split('-')
            }
            let right = (date[1] || '00:00:00').split(':')
            let a = left[1].length>1 ? left[1] : '0' + left[1]
            let b = left[2].length>1 ? left[2] : '0' + left[2]
            let c = right[0].length>1 ? right[0] : '0' + right[0]
            let d = right[1].length>1 ? right[1] : '0' + right[1]
            let e = right[2].length>1 ? right[2] : '0' + right[2]
            item.time = `${left[0]}/${a}/${b} ${c}:${d}:${e}`
              await model.findOneAndUpdate({
                  _id:item._id
              }, item).then(rel => {
                if(rel){
                  // console.log('刷新时间成功')
                }
              })
          }
        })
      }

    })
  }

  // let {
  //     _id
  // } = ctx.request.body
  // await informations.findOneAndUpdate({
  //     _id
  // }, data).then(rel => {
  //     return200('时间更新成功', rel, ctx)
  // })
}


module.exports = {
  datatime,
  datas
}
