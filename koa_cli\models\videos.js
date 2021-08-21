const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    fromid:{type:String,default: 'school'},
    videoname:{type:String,default: 'school'},
    videourl:{type:String,default: ''},
    time:{type:String,default: ''}
})

const Video = mongoose.model('videos',videoSchema)
module.exports = {
  Video
}
