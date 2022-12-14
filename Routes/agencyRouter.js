const express = require('express');
const router = express.Router();
const agencyController = require('../controller/agencyController');
const adsController = require('../controller/adsController');
router.route('/registerAgency').post(agencyController.registerAgency);
router.route('/loginAgencyOtp').post(agencyController.agencyLoginOtp);
router.route('/loginAgency').post(agencyController.agencyLogin);
router
  .route('/getAllDrivers')
  .get(agencyController.protect, agencyController.getAllDrivers);
router.route('/searchDrivers').get(agencyController.protect);
router.route('/forgotPasswordAgency').post(agencyController.forgotPassword);
router.route('/resetOtp').post(agencyController.ConfirmOtpReset);
router.route('/resetPasswordAgency').put(agencyController.resetPassword);
router
  .route('/searchDriverByVehicle/:vehicles')
  .get(agencyController.protect, agencyController.searchDriver);
router
  .route('/editAgency')
  .put(agencyController.protect, agencyController.editAgency);
router
  .route('/myProfile')
  .get(agencyController.protect, agencyController.profile);
router.route('/getAds').get(adsController.getAds);
module.exports = router;
