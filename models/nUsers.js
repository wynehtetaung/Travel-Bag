var mongoose = require("mongoose")
var Schema = mongoose.Schema
var bcrypt = require("bcryptjs")

var UserSchema = new Schema({
  normalName: {
    type: String,
    required: true,
  },
  normalEmail: {
    type: String,
    required: true,
    unique: true,
  },
  normalPassword: {
    type: String,
    required: true,
  },
  // normalemailToken: {
  //   type: String,
  // },
  normalisVerified: {
    type: Boolean,
  },
  normalDate: {
    type: Date,
    default: Date.now(),
  },
  token: {
    type: String,
    default: "",
  },
})

UserSchema.pre("save", function (next) {
  this.normalPassword = bcrypt.hashSync(
    this.normalPassword,
    bcrypt.genSaltSync(8),
    null
  )
  next()
})

UserSchema.statics.compare = function (cleartext, encrypted) {
  return bcrypt.compareSync(cleartext, encrypted)
}

module.exports = mongoose.model("NUsers", UserSchema)
