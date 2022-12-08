const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a admin musst need name'],
    unique: true,
  },

  email: {
    type: String,
    required: [true, 'Email required'],
    Math: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      'please enter a  valid email id',
    ],

    validate: [validator.isEmail, 'please provide a email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'a admin must need a password'],
    select: false,
  },
});

adminSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
});
// adminSchema.methods.checkPassword = async function (adminPassword, password) {
//   console.log('hello');
//   console.log(await bcrypt.compare(adminPassword, password));
//   await bcrypt.compare(adminPassword, password).then((el) => {
//     console.log(el);
//   });
//   // return await bcrypt.compare(currentAgencyPassword, userInputtedpassword);
// };

adminSchema.methods.checkPassword = async function (
  userInputtedpassword,
  currentAgencyPassword
) {
  console.log(
    await bcrypt.compare(currentAgencyPassword, userInputtedpassword)
  );
  return await bcrypt.compare(currentAgencyPassword, userInputtedpassword);
};
// adminSchema.methods.correctPassword = async function (adminPassword, password) {
//   console.log(await bcrypt.compare(password, adminPassword));
//   return await bcrypt.compare(password, adminPassword);
// };
const adminModel = mongoose.model('Admin', adminSchema);
module.exports = adminModel;
