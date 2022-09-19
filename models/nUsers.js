var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");

var UserSchema = new Schema({
  normalName: {
    type: String,
    required: true,
  },
  normalEmail: {
    type: String,
    required: true,
  },
  normalPassword: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("NUsers", UserSchema);
