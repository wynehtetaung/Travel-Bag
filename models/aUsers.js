var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");

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
  agentemailToken: {
    type: String,
  },
  agentisVerified: {
    type: Boolean,
  },
  agentDate: {
    type: Date,
    default: Date.now(),
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
