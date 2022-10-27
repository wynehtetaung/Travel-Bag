var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
    type: String,
    require: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "aUsers",
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Post", PostSchema);
