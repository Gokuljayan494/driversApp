const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf();
const adminController = require('../controller/adminController');
router.route('/registerAdmin').post(adminController.adminCreate);
router.route('/loginAdmin').post(adminController.loginAdmin);
router
  .route('/totalDriversAndTotalAgencies')
  .get(adminController.protect, adminController.getTotalDrivers);
// router
//   .route('/totalAgencies')
//   .get(adminController.protect, adminController.getTotalAgencys);

module.exports = router;
