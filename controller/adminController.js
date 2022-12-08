const AdminModel = require('../model/adminModel');
const DriverModel = require('../model/driversModel');
const AgencyModel = require('../model/agencyModel');

const jwt = require('jsonwebtoken');
const signToken = (id) => {
  return jwt.sign({ id }, `THE-SECRET-VALUE-9898-ALLOWS-TO-OPEN-ADMIN`, {
    expiresIn: `1d`,
  });
};

exports.adminCreate = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    admin = await AdminModel.create({ name, email, password });
    res.status(200).json({ status: 'sucess', admin });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      throw new Error('enter the field properly');
    }
    let admin = await AdminModel.findOne({ email }).select('+password');
    console.log(admin);
    let adminCheck = await admin.checkPassword(admin.password, password);
    console.log(adminCheck);
    // let adminPassword = await admin.correctPassword(admin.password, password);
    if (!admin || !adminCheck) throw new Error('wrong credentials');
    const token = signToken(admin._id);
    res.status(200).json({ status: 'sucess', admin, token });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};

exports.protect = async (req, res, next) => {
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
    console.log(token);
    // 2) Verification token
    const decoded = jwt.verify(
      token,
      `THE-SECRET-VALUE-9898-ALLOWS-TO-OPEN-ADMIN`
    );
    console.log(decoded);

    // 3) Check if user still exists
    const currentUser = await AdminModel.findById(decoded.id);
    console.log(currentUser);
    if (!currentUser) {
      throw new Error('this token is not valid for the admin');
    }

    req.user = currentUser;
    // res.locals.user = currentUser;
    next();
  } catch (err) {
    res.status(400).json({ Status: 'fail', message: `Error:${err.message}` });
  }
};

exports.getTotalDrivers = async (req, res) => {
  try {
    let driver = await DriverModel.find();
    let drivers = driver.length - 1;
    let agencies = await DriverModel.find();
    agencies = agencies.length - 1;
    res.status(200).json({ status: 'sucess', drivers, agencies });
  } catch (err) {
    res.status(400).json({ Status: 'fail', message: `Error:${err.message}` });
  }
};

// exports.getTotalAgencys = async (req, res) => {
//   try {
//     let agencys = await DriverModel.find();
//     agencys = agencys.length - 1;
//     res.status(200).json({ status: 'sucess', agencys });
//   } catch (err) {
//     res.status(400).json({ Status: 'fail', message: `Error:${err.message}` });
//   }
// };
