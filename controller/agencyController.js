const AgencyModel = require('../model/agencyModel');
const sendEmail = require('../utils/email');
let handlebars = require('handlebars');
const jwt = require('jsonwebtoken');
const DriverModel = require('../model/driversModel');
const signToken = (id) => {
  return jwt.sign({ id }, `THE-SECRET-VALUE-9898-ALLOWS-TO-OPEN-AGENCY`, {
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
    res.status(200).json({ status: 'sucess', agecny });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.agencyLoginOtp = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(password);
    if (!email && !password) throw new Error('please enter the inputs');
    // find the agency whose trying to login
    let agency = await AgencyModel.findOne({ email }).select('+password');
    if (!agency) {
      throw new Error('no agency found');
    }
    console.log(`agencyPassword:${agency.password}`);

    // console.log(await agency.checkPassword(agency.password, password));
    console.log(`------------`);
    console.log(`------------`);
    console.log(agency);
    let agencyCheck = await agency.checkPassword(agency.password, password);
    console.log(`------------`);
    console.log(`AgencyCheck:${agencyCheck}`);
    if (!agency || !agencyCheck) {
      throw new Error('wrong credentials');
    }

    // let agency = await AgencyModel.findOne({ email });
    // console.log(agency);
    if (agency.status === true) {
      let agencyoTP = agency.createOtp();

      // create random number for OTP

      await agency.save({ validateBeforeSave: false });

      // send to user agency
      console.log(agency);
      let message = ` 
      
      // <table><tr><td>

      // </td></tr></table>
      <h1> Hello!</h1>\n<div>This is your OTP FOR AGENCY. \n <h3> ${agencyoTP}</h3>.\nFor Login to Drivers App. \n Regards Drivers App</div>`;
      agency = await sendEmail({
        email: agency.email,
        subject: `your login otp`,
        message,
      });
    } else {
      throw new Error('Subscribe');
    }
    res.status(200).json({ status: 'sucess', message: 'otp sent to mail' });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

exports.agencyLogin = async (req, res) => {
  try {
    const { OTP } = req.body.otp;
    console.log(req.body);
    console.log(req.body.otp);

    if (!req.body.otp) throw new Error('Enter otp correctly');

    // let currentAgency = await AgencyModel.findOne({ OTP: req.body.otp });

    currentAgency = await AgencyModel.findOne({
      OTP: req.body.otp,
      otpExpires: { $gte: Date.now() },
    });
    console.log(currentAgency);
    if (!currentAgency) {
      throw new Error('invalid agency please register first');
    }
    console.log(currentAgency);

    if (currentAgency.status === true) {
      let token = signToken(currentAgency._id);
      if (!token) {
        throw new Error('invalid Agency');
      }
      res.status(200).json({ status: 'sucess', currentAgency, token });
    } else {
      res.status(400).json({ status: 'fail', message: `Error:not subscribed` });
    }
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};
exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  try {
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
      `THE-SECRET-VALUE-9898-ALLOWS-TO-OPEN-AGENCY`
    );

    // 3) Check if user still exists
    const currentUser = await AgencyModel.findById(decoded.id);
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
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await DriverModel.find();
    let registeredDrivers = [];
    drivers.forEach((el) => {
      if (el.status === true) {
        registeredDrivers.push(el);
      }
    });
    console.log(registeredDrivers);
    res.status(200).json({ status: 'sucess', registeredDrivers });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};

// exports.driversSearch = async (req, res) => {
//   try {
//     drivers = await DriverModel.find({});

//     res.status(200).json({ status: "sucess", registeredDrivers });
//   } catch (err) {
//     res.status(400).json({ status: "Fail", message: `Error:${err.message}` });
//   }
// };

exports.forgotPassword = async (req, res) => {
  try {
    let agency = await AgencyModel.findOne({ email: req.body.email });
    let agencyOtp = agency.createOtp();
    await agency.save({ validateBeforeSave: false });
    let message = ` 

  <h1>Hello!</h1>\n<div>This is your OTP FOR AGENCY reset password. \n <h3> ${agencyOtp}</h3>. \n For Login to Drivers App. \n Regards \n Drivers App</div>`;
    agency = await sendEmail({
      email: agency.email,
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

exports.resetPassword = async (req, res) => {
  try {
    let currentAgency = await AgencyModel.findOne({
      OTP: req.body.otp,
      otpExpires: { $gte: Date.now() },
    });
    if (!currentAgency) {
      throw new Error('invalid otp or No agency found');
    }
    currentAgency.password = req.body.password;
    currentAgency.passwordConfirm = req.body.passwordConfirm;
    // currentAgency.OTP=
    currentAgency.save();
    res.status(200).json({ status: 'sucess', message: 'password resetted' });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};
exports.searchDriver = async (req, res) => {
  try {
    // let vehicles = [];
    // vehicles.push(req.params.vehicles);
    console.log(req.params.vehicles);
    let searchVehicles = req.params.vehicles;
    let vehicles = searchVehicles.split(',');
    console.log(vehicles);
    let SearchedDrivers = await DriverModel.find({
      selectVehicle: {
        $elemMatch: { $elemMatch: { $in: vehicles } },
      },
    });

    res.status(200).json({
      status: 'sucess',
      result: this.searchDriver.length,
      SearchedDrivers,
    });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};
exports.editAgency = async (req, res) => {
  try {
    let agecny = await AgencyModel.findById(req.user);
    agecny.mobile = req.body.mobile || agecny.mobile;
    agecny.companyName = req.body.companyName || agecny.companyName;
    agency = agecny.save({ validateBeforeSave: false });
    res.status(200).json({ status: 'sucess', agecny });
  } catch (err) {
    res.status(400).json({ status: 'Fail', message: `Error:${err.message}` });
  }
};
