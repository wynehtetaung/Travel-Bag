var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");

var UserSchema = new Schema({
  adminName: {
    type: String,
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
    unique: true,
  },
  adminPassword: {
    type: String,
    required: true,
  },
  adminDate: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre("save", function (next) {
  this.adminPassword = bcrypt.hashSync(
    this.adminPassword,
    bcrypt.genSaltSync(8),
    null
  );
  next();
});

UserSchema.statics.compare = function (cleartext, encrypted) {
  return bcrypt.compareSync(cleartext, encrypted);
};

module.exports = mongoose.model("admin", UserSchema);
