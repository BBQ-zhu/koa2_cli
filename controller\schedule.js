/***
 * 自动化脚本，每天定时清理意向客户中的公海客户重复的数据，只保留最新数据
 */
const schedule = require('node-schedule');
const {
  integrate
} = require('../models/integrate')
const {
  customer
} = require('../models/customer')
const {
  enterprise
} = require('../models/enterprise')
const {
  logs
} = require('../models/logs')
const scheduleCronstyle = () => {
  //每天1点1分30秒的时候执行:
  schedule.scheduleJob('30 1 2 * * *', async () => {
     await checkData(integrate, 'manager1')
     await checkData(customer, 'manager2')
     await checkData(enterprise, 'manager2')
     await delLogs()
  });
}

const delLogs = async () => {
  await logs.aggregate([{
    $match: {}
  }, //用于过滤数据
  {
    $sort: {
      "time": -1
    }
  }, //倒叙排序
  {
    $project: {
      __v: 0
    }
  },
  {
    "$facet": {
      "total": [{
        "$count": "total"
      }],
      "data": [{
        "$skip": Number(66666)
      }]
    }
  }
  ])
    .then(rel => {
      if (rel[0].total[0].total > 0) {
        let arr = rel[0].data
        arr.forEach(async item => {
          await logs.findOneAndDelete({
            _id: item._id
          })
        })
      }
    })
}

const checkData = async (tabel, manager) => {
  var match = {}
  match['$or'] = [{ status: '待审核' }, { status: '审核中' }, { status: '驳回' }, { status: '拒绝' }, { status: '通过' }]
  match[manager] = { "$ne": '' } //客户经理不为空时
  await tabel.aggregate([{
    $match: match//用于过滤数据
  }]).then(rel => {
    if (rel) {
      rel.map(async item => {
        if (item.schedate && item.schedate >= 0) {
          item.schedate -= 1
          if (!item.schedate) {
            //只有综合服务才需要入公海时去重
            if (manager == 'manager1') {
              var obj = {}
              obj['$or'] = [{ status: '待审核' }, { status: '审核中' }, { status: '驳回' }, { status: '拒绝' }, { status: '通过' }]
              obj[manager] = ''
              obj['phone'] = item.phone
              await integrate.aggregate([{
                $match: obj //用于过滤数据
              }]).then(res => {
                res.map(async val => {
                  if (val.type == item.type && val.type != '意向客户') {
                    await integrate.findOneAndDelete({
                      _id: val._id
                    })
                  } else if (
                    val.type == item.type &&
                    val.type == '意向客户' &&
                    val.proname == '金融客户'
                  ) {
                    await integrate.findOneAndDelete({
                      _id: val._id
                    })
                  } else if (
                    val.type == item.type &&
                    val.type == '意向客户' &&
                    val.proname == '企业客户' &&
                    val.comtype == item.comtype
                  ) {
                    await integrate.findOneAndDelete({
                      _id: val._id
                    })
                  }

                })
              })
            }
            item[manager] = ''
          }
        } else {
          item.schedate = 14
        }
        await tabel.findOneAndUpdate({
          _id: item._id
        }, item)
        // console.log(item)
      })
    }
  })
}
module.exports = {
  scheduleCronstyle
}

 // 任务定时器
 // schedule.scheduleJob('30 * * * * *', () => {
 //   console.log('scheduleCronstyle:' + new Date());
 // });
 // 每分钟的第30秒触发： '30 * * * * *'

 // 每小时的1分30秒触发 ：'30 1 * * * *'

 // 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'

 // 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'

 // 2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'

 // 每周1的1点1分30秒触发 ：'30 1 1 * * 1'
