const mongoose = require("mongoose");

//note "String is a class used in node/mongoDB"
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
});
// this will automaticly by stored in collection "posts"
module.exports = mongoose.model('Post', postSchema);
