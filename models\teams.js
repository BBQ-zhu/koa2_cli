const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
  type:{type:String,default:"one"},
  teamname:{type:String,defalut:'铸力'}
})

const teams = mongoose.model('teams',teamSchema)

module.exports = {
  teams
}
