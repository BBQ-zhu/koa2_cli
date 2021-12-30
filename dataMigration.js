/**
 * 报备客户\贷款客户数据迁移脚本
 */
const { User } = require('../models/users') //员工数据库
const { integrate } = require('../models/integrate')
const { customer } = require('../models/customer')
const dataChange1 = require('./tbbaobeis') // 旧的报备客户数据 
const dataChange2 = require('./tbslbs') // 旧的贷款客户数据
// 报备客户数据
const dataMig1 = async () => {
  let data = JSON.parse(dataChange1)
  let userList = await User.find()
  for (let i = 0; i < data.length; i++) {
    // let newManager = await findUser(userList, data[i].manager) //客户经理转换
    let newTime = await timeSerialization(data[i].updatetime.$date) //时间序列化
    await integrate.find({ phone: data[i].phone, type: '意向客户', proname: data[i].btype == '贷款服务' ? '金融客户' : '企业客户' }).then(async res => {
      // 如果查不到就新增
      if (!res.length > 0) {
        let obj = {
          type: '意向客户',
          proname: data[i].btype == '企业服务' ? '企业客户' : '金融客户',
          name: data[i].name,
          phone: data[i].phone,
          manager1: '', //newManager
          manager2: '',
          hires: data[i].jobcfy == '自雇人士' ? '企业主' : '上班族',
          social: '',
          provident: '',
          houses: data[i].havehouse == '有' ? '是' : '否',
          car: data[i].havecar == '有' ? '是' : '否',
          policy: data[i].havesafe == '有' ? '是' : '否', //保险
          sesame: '',
          microcredit: '',
          credit: '',
          tobacco: '',
          comtype: '',
          othercomtype: '',
          vipstatus: '新客户',
          status: '待审核',
          feedback: '',
          schedate: 0,
          remarks: data[i].progress,
          time: newTime,
        }
        await integrate.create(obj).then(rel => {
          if (rel) {
            console.log('新增成功！')
          }
        })
      } else {
        console.log(res[0].phone + '已存在')
      }
    })
  }
}

// 贷款客户数据
const dataMig2 = async () => {
  let data = JSON.parse(dataChange2)
  let userList = await User.find()
  for (let i = 0; i < data.length; i++) {
    let newManager1 = await findUser(userList, data[i].rsmanager.khmanager) //推荐经理-客户经理转换
    let newManager2 = await findUser(userList, data[i].rsmanager.hxmanager) //权证经理-客服经理转换
    let newTeam = await findTeam(userList, data[i].rsmanager.khmanager) //查询所属团队
    let newTime = await timeSerialization(data[i].updatetime.$date) //时间序列化
    let newAge = await findAge(data[i].basic.idcard) //获取年龄
    await integrate.find({ phone: data[i].phone }).then(async res => {
      if (!res.length > 0) {
        let obj = {
          type: '意向客户',
          proname: '金融客户',
          name: data[i].name,
          phone: data[i].phone,
          manager1: '',//newManager1
          manager2: '',
          hires: data[i].income.employtype == '自雇' ? '企业主' : '上班族',
          social: '',
          provident: '',
          houses: data[i].basic.havehouse == '有' ? '是' : '否',
          car: data[i].car.carnum ? '是' : '否',
          policy: data[i].insurance.icname ? '是' : '否', //保险
          sesame: '',
          microcredit: '',
          credit: '',
          tobacco: '',
          comtype: '',
          othercomtype: '',
          vipstatus: '新客户',
          status: '待审核',
          feedback: '',
          schedate: 0,
          remarks: data[i].remerks,
          time: newTime,
        }
        await integrate.create(obj).then(rel => {
          if (rel) {
            console.log('贷款客户转意向客户新增成功！')
          }
        })
      } else {
        console.log('贷款客户转意向客户已存在！')
      }
    })
    await customer.find({ phone: data[i].phone }).then(async res => {
      // 如果查不到就新增
      if (!res.length > 0) {
        let obj = {
          name: data[i].name, //姓名
          phone: data[i].phone, //电话
          idcard: data[i].basic.idcard, //身份证
          age: newAge, //年龄
          fund: data[i].basic.fund, //需求资金
          utility: data[i].basic.funduse, //用途
          tenor: data[i].basic.period, //贷款期限
          matrimony: data[i].basic.marriage == '离婚' ? '离异' : data[i].basic.marriage, //婚姻状况
          children: '', //子女姓名
          knowing: data[i].spouse.sknow, //已婚配偶是否已知晓
          domicile: data[i].basic.address, //户籍所在地
          address: '', //现居城市
          addressdetail: '', //详细地址
          hires: data[i].income.employtype == '自雇' ? '企业主' : '上班族', //雇佣类型
          unit: data[i].income.unitname, //工作单位名称
          unitposition: data[i].income.jobtitle, //工作岗位
          unitadress: data[i].income.unitaddress, //单位地址
          unitphone: data[i].income.unitphone, //单位电话
          entrytime: data[i].income.entrytime, //入职时间
          revenue: data[i].income.mincome, //月收入
          social: data[i].income.accumulatefund ? '6个月以上' : '无社保', //是否购买社保
          provident: data[i].income.accumulatefund ? '6个月以上' : '无公积金', //是否购买公积金、
          proyears: '', //公积金已缴存年限
          probase: data[i].income.accumulatefund, //公积金已缴存基数
          socialyear: '', //社保缴存年限
          houses: data[i].basic.havehouse == '有' ? '是' : '否', //是否有房
          housesname: data[i].house.villagename, //小区名称
          houaddress: data[i].house.houseaddress, //小区位置
          housetime: data[i].house.buyingtime, //房屋购买时间
          housearea: data[i].house.housingarea, //房屋面积
          housetype: data[i].basic.havehouse == '有' ? '商品房' : '', //房屋类型：商品房、自建房
          houpayment: data[i].house.purchase, //全款还是按揭
          houmortgage: '', //是否已抵押
          houamount: data[i].house.repayment, //抵押贷款金额
          car: data[i].car.carnum ? '是' : '否', //是否有车
          carbrand: data[i].car.carbrand, //车辆品牌
          caryear: '', //车辆购买时间
          carprice: data[i].car.nakedprice, //车辆评估价
          carpayment: data[i].car.purchase, //车辆全款还是按揭
          carema: data[i].car.repayment, //按揭剩余本金
          policy: data[i].insurance.icname ? '是' : '否', //有无商业保单
          policyname: data[i].insurance.icname, //投保公司名称
          policyear: data[i].insurance.payyear ? '一年以上' : '', //已投保年限
          paymentmethod: data[i].insurance.payway, //缴费方式
          policypre: data[i].insurance.payamount, //缴费金额
          creditip: '', //征信是否白名单
          lawsuits: '', //是否有官司
          record: '', //是否有案底
          hobbies: '', //是否有不良嗜好
          contacts1: data[i].contact.user1.cname, //紧急联系人1
          conphone1: data[i].contact.user1.cphone, //联系人电话1
          conrelat1: data[i].contact.user1.crelation, //联系人的关系1
          contacts2: data[i].contact.user2.cname, //紧急联系人2
          conphone2: data[i].contact.user2.cphone, //联系人电话2
          conrelat2: data[i].contact.user2.crelation, //联系人的关系2
          contacts3: data[i].contact.user3.cname, //紧急联系人3
          conphone3: data[i].contact.user3.cphone, //联系人电话3
          conrelat3: data[i].contact.user3.crelation, //联系人的关系3
          contacts4: '', //紧急联系人4
          conphone4: '', //联系人电话4
          conrelat4: '', //联系人的关系4
          hometeam: newTeam, //归属团队
          manager1: newManager1, //客户经理
          manager2: newManager2, //客服经理
          manager3: '', //代办客服
          status: '审核结束', //审核状态
          remarks: data[i].remerks, //备注信息
          time: newTime, //创建时间
          sesame: '', //芝麻分
          microcredit: '', //微粒贷
          credit: '', //信用卡
          tobacco: '', //是否有烟草证
          tobaccotime: '', //烟草证办证时间
          volumesmoke: '', //烟草证月开烟量
          tobaccorank: '', //烟草证等级
          enterprise: '', //法人/股东变更
          ticket: '', //法人/股东占股
          invoicing: '', //年开票金额
          paying: '', //年缴税金额
          taxrecord: '', //开票记录
          grade: '', //纳税等级
          identity: '', //法人/股东
          establishment: data[i].income.establishtime, //企业成立时间
          feedback: data[i].rsmanager.additioninfo, //审批反馈
          productList: [], //匹配产品
          recomMony: 0, //匹配产品最高可贷金额
        }
        await customer.create(obj).then(rel => {
          if (rel) {
            console.log('贷款客户新增成功！')
          }
        })
      } else {
        console.log(res[0].phone + '贷款客户已存在')
      }
    })
  }
}


// 查询员工是否存在
const findUser = async (userList, name) => {
  if (!name) { return '' }
  let uid = ''
  for (let item of userList) {
    if (item.username == name) {
      uid = item.uid || ''
      break;
    }
  }
  return uid
}

//查询所属团队
const findTeam = async (userList, name) => {
  if (!name) { return '' }
  let team = ''
  for (let item of userList) {
    if (item.username == name) {
      team = item.team || ''
      break;
    }
  }
  return team
}

// 时间序列化
const timeSerialization = async (time) => {
  if (!time) { return '' }
  let a = time.split('T')[0].split('-')
  return `${a[0]}/${a[1]}/${a[2]} 00:00:00`
}

// 根据身份证查询年龄
const findAge = (id) => {
  if (!id || id.length != 18) {
    return ''
  } else {
    let age = 2021 - parseInt(id.substr(6, 4))
    return age
  }

}

module.exports = {
  dataMig1,
  dataMig2
}
