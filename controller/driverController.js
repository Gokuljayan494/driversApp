// const DriverModel = require("../model/driversModel");
const DriverModel = require("../model/driversModel");

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

    const licence = LicenceType.split(" ");
    const vehicles = selectVehicle.split(" ");
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
    res.status(200).json({ status: "sucess", driver });
  } catch (err) {
    res.status(400).json({ status: "Fail", message: `Error:${err.message}` });
  }
};
