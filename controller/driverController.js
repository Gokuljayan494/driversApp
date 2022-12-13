// const DriverModel = require("../model/driversModel");
const DriverModel = require('../model/driversModel');
const sendEmail = require('../utils/email');

const jwt = require('jsonwebtoken');
const AgencyModel = require('../model/agencyModel');
const signToken = (id) => {
  return jwt.sign({ id }, `THE-SECRET-VALUE-9898-ALLOWS-TO-OPEN-DRIVER`, {
    expiresIn: `1d`,
  });
};
exports.register = async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      password,
      passwordConfirm,
      state,
      district,
      pincode,
      LicenceType,
      selectVehicle,
    } = req.body;
    console.log();

    const licence = LicenceType.split(' ');

    const vehicles = selectVehicle.split(' ');
    driver = await DriverModel.create(
      {
        name: name,
        mobile: mobile,
        email,
        password,
        passwordConfirm,
        state,
        district,
        pincode,
      }
      // req.body
    );

    // LicenceType.split(" ");
    // driver.selectVehicle.push(l);
    driver.LicenceType.push(licence);

    driver.selectVehicle.push(vehicles);
    driver = await driver.save();

    // const driver = await DriverModel.create({
    //   name,
    //   mobile,
    //   firstName,
    //   lastName,
    //   email,
    //   password,
    //   passwordConfirm,
    //   state,
    //   district,
    //   pincode,
    //   LicenceType: req.body.LicenceType,
    //   selectVehicle: req.body.selectVehicle,
    // });
    console.log(`----------------------`);
    console.log(LicenceType);
    res.status(200).json({ status: 'sucess', driver });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.driverLoginOtp = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('please enter the inputs');
    // find by email
    let driver = await DriverModel.findOne({ email }).select('+password');
    // if (!driver) {
    // throw new Error("enter ");
    // }
    let driverCheck = await driver.checkPassword(driver.password, password);
    console.log(driverCheck);
    if (!driver || !driverCheck) {
      throw new Error('wrong credentials');
    }

    if (driver.status === true) {
      let driverOtp = driver.createOtp();

      // create random number for OTP
      await driver.save({ validateBeforeSave: false });

      // send to user Driver

      let message = ` 
      
      <h1>Hello!</h1>\n<div>This is your OTP FOR Driver. \n <h3> ${driverOtp} </h3> \n For Login to Drivers App. \n Regards</div>`;
      agency = await sendEmail({
        email: driver.email,
        subject: `your login otp`,
        message,
      });
    } else {
      throw new Error('subscribe first');
    }
    res.status(200).json({ status: 'sucess', message: 'OTP has sent to mail' });
  } catch (err) {
    res.status(401).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.driverLogin = async (req, res) => {
  try {
    let { otp } = req.body;
    if (!otp) throw new Error('enter the otp correctly');
    let currentDriver = await DriverModel.findOne({
      otp: req.body.otp,
      otpExpires: { $gte: Date.now() },
    });
    if (!currentDriver) {
      throw new Error('driver not found please register first');
    }

    if (currentDriver.status === true) {
      let token = signToken(currentDriver._id);
      if (!token) {
        throw new Error('invalid driver ');
      }
      res.status(200).json({ status: 'sucess', currentDriver, token });
    } else {
      res.status(401).json({ status: 'fail', message: `Error:not subscribed` });
    }
  } catch (err) {
    res.status(401).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};
exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new Error('login in first');
    }

    // 2) Verification token
    const decoded = jwt.verify(
      token,
      `THE-SECRET-VALUE-9898-ALLOWS-TO-OPEN-DRIVER`
    );
    console.log(decoded);
    // 3) Check if user still exists
    const currentUser = await DriverModel.findById(decoded.id);
    console.log(currentUser);
    if (!currentUser) {
      throw new Error('this token is not valid for the user');
    }

    req.user = currentUser;
    // res.locals.user = currentUser;
    next();
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
exports.getAllAgencys = async (req, res) => {
  try {
    const agencys = await AgencyModel.find();

    let registeredAgencies = [];
    agencys.forEach((el) => {
      if (el.status === true) {
        registeredAgencies.push(el);
      }
    });
    res.status(200).json({ status: 'sucess', registeredAgencies });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let driver = await DriverModel.findOne({ email: req.body.email });
    let driverOtp = driver.createOtp();
    await driver.save({ validateBeforeSave: false });
    let message = ` 

   <h1>Hello!</h1>\n<div>This is your OTP For Driver reset password. \n <h3>${driverOtp}<h3>. \n For Login to Drivers App. \n Regards \n Drivers App</div>`;
    driver = await sendEmail({
      email: driver.email,
      subject: `your password reset otp`,
      message,
    });
    res.status(200).json({
      status: 'sucess',
      message: `Otp has sent to mail `,
    });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.ConfirmOtpReset = async (req, res) => {
  try {
    let currentDriver = await DriverModel.findOne({
      otp: req.body.otp,
      otpExpires: { $gte: Date.now() },
    });
    if (!currentDriver) {
      throw new Error('invalid otp ');
    }
    res.status(200).json({ status: 'sucess', message: 'valid otp' });
  } catch (err) {
    res.status(200).json({ status: 'sucess', message: `Error:${err.message}` });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let { email, otp } = req.body;
    console.log(email, otp);
    let currentDriver = await DriverModel.findOne({
      email,
      otp,
      otpExpires: { $gte: Date.now() },
    });
    console.log(currentDriver);
    if (!currentDriver) {
      throw new Error('invalid otp or No agency found');
    }
    currentDriver.password = req.body.password;
    currentDriver.passwordConfirm = req.body.passwordConfirm;
    // currentAgency.OTP=
    currentDriver.save();
    res.status(200).json({ status: 'sucess', message: 'password resetted' });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.editDriver = async (req, res) => {
  try {
    const driver = await DriverModel.findById(req.user);
    driver.name = req.body.name || driver.name;
    driver.mobile = req.body.mobile || driver.mobile;
    await driver.save({ validateBeforeSave: false });
    res.status(200).json({ status: 'sucess', driver });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.profile = async (req, res) => {
  try {
    const driver = await DriverModel.findById(req.user);
    res.status(200).json({ status: 'sucess', driver });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};
