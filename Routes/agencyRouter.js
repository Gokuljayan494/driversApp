const express = require("express");
const router = express.Router();
const agencyController = require("../controller/agencyController");

router.route("/registerAgency").post(agencyController.registerAgency);
router.route("/loginAgencyOtp").post(agencyController.agencyLoginOtp);
router.route("/loginAgency").post(agencyController.agencyLogin);
router
  .route("/getAllDrivers")
  .get(agencyController.protect, agencyController.getAllDrivers);

module.exports = router;
