var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");
var nanoid = require("nanoid");

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
  normalisVerified: {
    type: Boolean,
  },
  normalDate: {
    type: Date,
    default: Date.now(),
  },
  token: {
    type: String,
    default: nanoid.urlAlphabet,
  },
});

UserSchema.pre("save", function (next) {
  this.normalPassword = bcrypt.hashSync(
    this.normalPassword,
    bcrypt.genSaltSync(8),
    null
  );
  next();
});

UserSchema.statics.compare = function (cleartext, encrypted) {
  return bcrypt.compareSync(cleartext, encrypted);
};

module.exports = mongoose.model("NUsers", UserSchema);
