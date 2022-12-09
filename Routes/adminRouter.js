const express = require('express');
const router = express.Router();
const csrf = require('csurf');

const csrfProtection = csrf();
const adminController = require('../controller/adminController');
const adsController = require('../controller/adsController');
router.route('/registerAdmin').post(adminController.adminCreate);
router.route('/loginAdmin').post(adminController.loginAdmin);
router
  .route('/totalDriversAndTotalAgencies')
  .get(adminController.protect, adminController.getTotalDrivers);

router
  .route('/GetAllDrivers')
  .get(adminController.protect, adminController.drivers);
router
  .route('/activateDrivers/:driverId')
  .put(adminController.protect, adminController.activateDrivers);
router
  .route('/activateAdmin/:agencyId')
  .put(adminController.protect, adminController.activateAgency);
router
  .route('/ads')
  .put(adsController.uploadAdsMulter, adsController.uploadAds);
module.exports = router;
