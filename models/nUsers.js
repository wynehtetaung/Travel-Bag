var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");

var UserSchema = new Schema({
  names: {
    type: String,
    required: true,
  },
  emails: {
    type: String,
    required: true,
  },
  passwords: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("NUsers", UserSchema);
