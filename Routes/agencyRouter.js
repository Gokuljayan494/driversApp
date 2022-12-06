const express = require("express");
const router = express.Router();
const agencyController = require("../controller/agencyController");

router.route("/registerAgency").post(agencyController.registerAgency);
router.route("/loginAgency").post(agencyController);

module.exports = router;
