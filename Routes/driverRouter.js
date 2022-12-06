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
module.exports = router;
