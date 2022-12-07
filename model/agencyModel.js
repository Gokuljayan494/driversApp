const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const agencySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "a company must need a name"],
      unique: true,
    },
    userName: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password needed"],
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
    phone: {
      type: String,
      required: [true, "a company must need a phone number"],
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
    state: { type: String, required: [true] },
    district: { type: String, required: [true] },
    pincode: { type: Number, required: [true] },
    OTP: { type: String, default: "notVerified" },
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
agencySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
agencySchema.methods.createOtp = function () {
  let OTP = Math.floor(1000 + Math.random() * 9000);
  this.OTP = OTP;
  this.otpExpires = Date.now() + 10 * 60 * 1000;
  return OTP;
};
agencySchema.methods.checkPassword = async function (
  userInputtedpassword,
  currentAgencyPassword
) {
  console.log(
    await bcrypt.compare(userInputtedpassword, currentAgencyPassword)
  );
  return await bcrypt.compare(currentAgencyPassword, userInputtedpassword);
};
const AgencyModel = mongoose.model("Agency", agencySchema);
module.exports = AgencyModel;
