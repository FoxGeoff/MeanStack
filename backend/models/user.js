const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//note "String is a class used in node/mongoDB"
const userSchema = mongoose.Schema({
  /* Note: unique is only for DB optimization not error handlng */
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

// this will automaticly be stored in collection "users"
module.exports = mongoose.model("User", userSchema);
