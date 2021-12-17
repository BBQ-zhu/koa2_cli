const mongoose = require('mongoose')

const statisticSchema = new mongoose.Schema({
    year: {
        type: Number,
        default: 0
    },
    monthlist: {
        type: Array,
        defalut: []
    },
    time:String
})

const statistics = mongoose.model('statistics', statisticSchema)

module.exports = {
  statistics
}
