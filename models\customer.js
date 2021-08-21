const mongoose = require('mongoose')


//客户资料管理
const customerSchema = new mongoose.Schema({
  name:String, //姓名
  phone:String, //电话
  idcard:String, //身份证
  age:String, //年龄
  fund:String, //需求资金
  utility:String, //资金用途
  tenor:String, //贷款期限
  matrimony:String, //婚姻状况
  children:String, //是否有子女
  knowing:String, //已婚配偶是否已知晓
  domicile:String, //户籍所在地
  address:String, //现居地址
  hires:String, //雇佣类型
  unit:String, //工作单位名称
  unitposition:String, //工作岗位
  unitadress:String, //单位地址
  unitphone:String, //单位电话
  entrytime:String, //入职时间
  revenue:String, //月收入
  provident:String, //是否购买公积金、社保
  proyears:String, //公积金已缴存年限
  probase:String, //公积金已缴存基数
  social:String, //社保缴存年限
  houses:String, //是否有房
  housesname:String, //小区名称
  houaddress:String, //小区位置
  housetime:String, //房屋购买时间
  housearea:String, //房屋面积
  housetype:String, //房屋类型：商品房、自建房
  houpayment:String, //全款还是按揭
  houmortgage:String, //是否已抵押
  houamount:String, //抵押贷款金额
  car:String, //是否有车
  carbrand:String, //车辆品牌
  caryear:String, //车辆购买时间
  carprice:String, //车辆评估价
  carpayment:String, //车辆全款还是按揭
  carema:String, //按揭剩余本金
  policy:String, //有无商业保单
  policyname:String, //投保公司名称
  policyear:String, //已投保年限
  policypre:String, //缴费金额
  credit:String, //征信是否白名单
  lawsuits:String, //是否有官司
  record:String, //是否有案底
  hobbies:String, //是否有不良嗜好
  contacts1:String, //紧急联系人1
  conphone1:String, //联系人电话1
  conrelat1:String, //联系人的关系1
  contacts2:String, //紧急联系人2
  conphone2:String, //联系人电话2
  conrelat2:String, //联系人的关系2
  contacts3:String, //紧急联系人3
  conphone3:String, //联系人电话3
  conrelat3:String, //联系人的关系3
  contacts4:String, //紧急联系人4
  conphone4:String, //联系人电话4
  conrelat4:String, //联系人的关系4
  remarks:String, //备注信息
  time:String, //创建时间
})

const customer = mongoose.model('customers', customerSchema)

module.exports = {
  customer
}
