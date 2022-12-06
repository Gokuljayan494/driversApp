const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a driver must need a name"],
      unique: true,
    },
    mobile: {
      type: Number,
      required: [true, "a driver must need a number"],
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
      required: [true, "password needed"],
      select: true,
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
    state: { type: String, required: [true] },
    district: { type: String, required: [true] },
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
      default: "notVerified",
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
DriverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
const DriverModel = mongoose.model("Driver", DriverSchema);

module.exports = DriverModel;
