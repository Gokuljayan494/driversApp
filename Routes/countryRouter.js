const express = require('express');
const countriesController = require('../controller/countriesController');
const router = express.Router();

router.route('/getAllCountries').get(countriesController.getAllCountries);
router.route('/getAllStates/:state').get(countriesController.getAllState);
router.route('/getAllCities/:cities').get(countriesController.getAllCities);

module.exports = router;
