const mongoose = require('mongoose')

//产品表
const productSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'all'
    },
    label: String, //产品标签
    introduct: Array, //服务介绍
    recommend: {
        type: String,
        default: '不推荐'
    }, //不推荐 推荐
    name: String,
    description: String, //描述
    newprice: String,
    oldprice: String,
    volume: String, // 总计销量
    productlogo: String,
    productimg: String,
    consulting: String, //总计咨询
    totalales: String, //没有使用
    totalview: String, //总计浏览
    details: String,
    time: String,
    recomtype: String, //活动类型 爆款、独家、新品、优惠、限时
    recomintro: { //介绍类型 无隐形费用、全程托管、专家顾问、一对一服务、急速办理、官方保障、银企合作
        type: Array,
        default: ['无隐形费用', '全程托管', '专家顾问']
    },
    cation: { //资质要求：'false'\'true'
        type: String,
        default: 'false'
    },
    minamount: String, //最低额度
    maxamount: String, //最高额度
    minterm: String, //最低期限
    maxterm: String, //最高期限
    interest: String, //月利息
    loandays: String, //放款天数
    address: Array, //放款省市 城市数组
    age: String, //n岁以下
    revenue: String, //月收入
    social: Array, //社保情况
    provident: Array, //公积金情况
    houses: String, //房屋情况
    car: String, //车辆情况
    policy: String, //保险情况
    sesame: Array, //芝麻分
    microcredit: Array, //微粒贷
    credit: String, //信用卡
    tobacco: String, //是否有烟草证
    tobaccotime: Array, //烟草证办证时间
    volumesmoke: Array, //烟草证月开烟量
    tobaccorank: Array, //烟草证等级
    identity: Array, //法人/股东
    enterprise: Array, //法人变更
    ticket: Array, //法人占股
    invoicing: Array, //年开票金额
    paying: Array, //年缴税金额
    taxrecord: Array, //开票记录
    grade: Array, //纳税等级
    establishment: Array, //企业成立时间
    hires: Array, //职业要求 数组
    match: Array, //匹配条件 数组
    key: String, //条件关键
    othercomponents: Array, //其他要求 数组
    demand: Array, //所需资料
    otherinformation: String //其他资料
})
const Product = mongoose.model('products', productSchema)

//产品分类表
const classSchema = new mongoose.Schema({
    name: {
        type: String,
        default: '默认名称'
    }, //导航名称
    number: {
        type: String,
        default: '0'
    }, //导航顺序
    super: {
        type: String,
        default: '否'
    }, //是否推荐至首页
    imgurl: {
        type: String,
        default: ''
    }, //导航图标
    remaks: String
})
const productClass = mongoose.model('productclass', classSchema)


module.exports = {
    Product,
    productClass
}
