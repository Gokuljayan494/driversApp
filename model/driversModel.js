const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a driver must need a name'],
      unique: true,
    },
    mobile: {
      type: Number,
      required: [true, 'a driver must need a number'],
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
      required: [true, 'password needed'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      //   required: [true, "password needed"],

      validate: {
        validator: function (el) {
          return el === this.password;
        },
      },
    },
    country: { type: String, required: [true] },

    state: { type: String, required: [true] },
    city: { type: String, required: [true] },
    pincode: { type: Number, required: [true] },
    LicenceType: {
      type: Array,
      //   type: Object,
      //   required: [true, "a driver must need LicenceType"],
      //   default: "LMV",
    },
    selectVehicle: {
      type: Array,
    },
    otp: {
      type: String,
      default: 'notVerified',
    },
    otpExpires: { type: Date },
    status: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);
DriverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
DriverSchema.methods.createOtp = function (next) {
  let OTP = Math.floor(1000 + Math.random() * 9000);
  this.otp = OTP;
  this.otpExpires = Date.now() + 10 * 60 * 1000;
  return OTP;
};
DriverSchema.methods.checkPassword = async function (
  userInputtedpassword,
  currentAgencyPassword
) {
  console.log(
    await bcrypt.compare(currentAgencyPassword, userInputtedpassword)
  );
  return await bcrypt.compare(currentAgencyPassword, userInputtedpassword);
};
const DriverModel = mongoose.model('Driver', DriverSchema);

module.exports = DriverModel;
