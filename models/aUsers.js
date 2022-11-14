var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");
var nanoid = require("nanoid");

var UserSchema = new Schema({
  agentName: {
    type: String,
    required: true,
  },
  agentEmail: {
    type: String,
    required: true,
    unique: true,
  },
  agentPassword: {
    type: String,
    required: true,
  },
  agentBio: {
    type: String,
    required: true,
  },
  agentPhone: {
    type: String,
    required: true,
  },
  agentCity: {
    type: String,
    required: true,
  },
  agentDate: {
    type: Date,
    default: Date.now(),
  },
  agenttoken: {
    type: String,
    default: nanoid.urlAlphabet,
  },
  normalisact_ban: {
    type: Boolean,
    default: true,
  },
  agentisVerified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", function (next) {
  this.agentPassword = bcrypt.hashSync(
    this.agentPassword,
    bcrypt.genSaltSync(8),
    null
  );
  next();
});

UserSchema.statics.compare = function (cleartext, encrypted) {
  return bcrypt.compareSync(cleartext, encrypted);
};

module.exports = mongoose.model("aUsers", UserSchema);
