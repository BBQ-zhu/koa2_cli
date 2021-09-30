const mongoose = require('mongoose')

const webSchema = new mongoose.Schema({
    fromid:{type:String,default: 'school'},
    videoname:{type:String,default: 'school'},
    videourl:{type:String,default: ''},
})

const WebControl = mongoose.model('webcontrols',webSchema)
module.exports = {
  WebControl
}
