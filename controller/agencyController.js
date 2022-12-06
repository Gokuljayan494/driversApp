const AgencyModel = require("../model/agencyModel");
const sendEmail = require("../utils/email");

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

exports.agencyLogin = async (req, res) => {
  try {
    // find the agency whose trying to login

    const agency = await AgencyModel.findOne({ email: req.body.email });
    let agencyoTP = agency.createOtp();

    // create random number for OTP

    await agency.save({ validateBeforeSave: false });

    // send to user agency

    const message = ` 

Hello!
This is your OTP. \n  ${agencyoTP}. \n For Login to Drivers App. \n Regards`;
    await sendEmail({
      email: agency.email,
      subject: `your login otp`,
      message,
    });

    res.status(200).json({ status: "sucess", agency });
  } catch (err) {
    res.status(400).json({ status: "Fail", message: `Error:${err.message}` });
  }
};
