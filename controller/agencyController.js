const AgencyModel = require("../model/agencyModel");
const sendEmail = require("../utils/email");
let handlebars = require("handlebars");
const jwt = require("jsonwebtoken");
const DriverModel = require("../model/driversModel");
const signToken = (id) => {
  return jwt.sign({ id }, `THE-SECRET-VALUE-9898-ALLOWS-TO-OPEN`, {
    expiresIn: `1d`,
  });
};
exports.registerAgency = async (req, res) => {
  try {
    const {
      companyName,
      userName,
      password,
      passwordConfirm,
      phone,
      email,
      state,
      district,
      pincode,
    } = req.body;
    const agecny = await AgencyModel.create({
      companyName,
      userName,
      password,
      passwordConfirm,
      phone,
      email,
      state,
      district,
      pincode,
    });
    res.status(200).json({ status: "sucess", agecny });
  } catch (err) {
    res.status(400).json({ status: "Fail", message: `Error:${err.message}` });
  }
};

exports.agencyLoginOtp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) throw new Error("please enter the inputs");
    // find the agency whose trying to login

    let agency = await AgencyModel.findOne({ email });
    console.log(agency);
    let agencyoTP = agency.createOtp();

    // create random number for OTP

    await agency.save({ validateBeforeSave: false });

    // send to user agency
    console.log(agency);
    let message = ` 

Hello!\nThis is your OTP FOR AGENCY. \n  ${agencyoTP}. \n For Login to Drivers App. \n Regards`;
    agency = await sendEmail({
      email: agency.email,
      subject: `your login otp`,
      message,
    });

    res.status(200).json({ status: "sucess", agency });
  } catch (err) {
    res.status(400).json({ status: "Fail", message: `Error:${err.message}` });
  }
};

exports.agencyLogin = async (req, res) => {
  try {
    const { OTP } = req.body.otp;
    console.log(req.body);
    console.log(req.body.otp);

    if (!req.body.otp) throw new Error("Enter otp correctly");

    // let currentAgency = await AgencyModel.findOne({ OTP: req.body.otp });
    currentAgency = await AgencyModel.findOne({ OTP: req.body.otp });
    console.log(currentAgency);
    if (!currentAgency) {
      throw new Error("invalid agency please register first");
    }
    console.log(currentAgency);

    if (currentAgency.status === true) {
      let token = signToken(currentAgency._id);
      if (!token) {
        throw new Error("invalid Agency");
      }
      res.status(200).json({ status: "sucess", currentAgency, token });
    } else {
      res.status(400).json({ status: "fail", message: `Error:not subscribed` });
    }
  } catch (err) {
    res.status(400).json({ status: "Fail", message: `Error:${err.message}` });
  }
};
exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new Error("login in first");
    }

    // 2) Verification token
    const decoded = jwt.verify(
      token,
      `THE-SECRET-VALUE-9898-ALLOWS-TO-OPEN-AGENCY`
    );

    // 3) Check if user still exists
    const currentUser = await AgencyModel.findById(decoded.id);
    console.log(currentUser);
    if (!currentUser) {
      throw new Error("this token is not valid for the user");
    }

    req.user = currentUser;
    // res.locals.user = currentUser;
    next();
  } catch (err) {
    res.status(400).json({ status: "fail", message: `Error:${err.message}` });
  }
};
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await DriverModel.find();
    res.status(200).json({ status: "sucess", drivers });
  } catch (err) {
    res.status(400).json({ status: "Fail", message: `Error:${err.message}` });
  }
};
