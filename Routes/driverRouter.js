const express = require("express");
const router = express.Router();
const driverController = require("../controller/driverController");

//////////////
// Register
router.post("/registerDriver", driverController.register);

module.exports = router;
