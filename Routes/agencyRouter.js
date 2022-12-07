const express = require("express");
const router = express.Router();
const agencyController = require("../controller/agencyController");

router.route("/registerAgency").post(agencyController.registerAgency);
router.route("/loginAgencyOtp").post(agencyController.agencyLoginOtp);
router.route("/loginAgency").post(agencyController.agencyLogin);
router
  .route("/getAllDrivers")
  .get(agencyController.protect, agencyController.getAllDrivers);
router.route("/searchDrivers").get(agencyController.protect);
router.route("/forgotPasswordAgency").post(agencyController.forgotPassword);
router.route("/resetPasswordAgency").put(agencyController.resetPassword);

module.exports = router;
