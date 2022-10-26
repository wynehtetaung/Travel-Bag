var mongoose = require("mongoose");
var Schema = require("Schema");

var PostSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  place: {
    type: String,
    require: true,
  },
  image: {
    type: File,
    require: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: agentUsers,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.models("Post", PostSchema);
