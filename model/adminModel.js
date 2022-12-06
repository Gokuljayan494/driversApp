const mongoose = require("mongoose");
const validator = require("validator");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a admin musst need name"],
    unique: true,
  },

  email: {
    type: String,
    required: [true, "Email required"],
    Math: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      "please enter a  valid email id",
    ],

    validate: [validator.isEmail, "please provide a email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "a admin must need a password"],
  },
});
const adminModel = mongoose.model("Admin", adminSchema);
module.exports = adminModel;
