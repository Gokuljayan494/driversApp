const express = require("express");
const router = express.Router();
const driverController = require("../controller/driverController");

//////////////
// Register
router.post("/registerDriver", driverController.register);
router.route("/loginDriverOtp").post(driverController.driverLoginOtp);
router.route("/loginDriver").post(driverController.driverLogin);
router
  .route("/getAllAgencys")
  .get(driverController.protect, driverController.getAllAgencys);
router.route("/forgotPasswordDriver").post(driverController.forgotPassword);
router.route("/resetPasswordDriver").put(driverController.resetPassword);

router
  .route("/editDriver")
  .put(driverController.protect, driverController.editDriver);
module.exports = router;
