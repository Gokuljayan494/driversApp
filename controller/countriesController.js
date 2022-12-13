const { set, STATES } = require('mongoose');
const { CountryCodes } = require('validator/lib/isISO31661Alpha2');

// import { Country, State, City } from 'country-state-city';
const country = require('country-state-city').Country;
const state = require('country-state-city').State;
const city = require('country-state-city').City;

exports.getAllCountries = async (req, res) => {
  try {
    let countries1 = [];
    console.log(country.getAllCountries());
    let countries = country.getAllCountries();
    // countries.forEach((el) => {
    //   console.log(el);
    // });

    countries.forEach((el) => {
      console.log(el.phonecode.startsWith('1'));
      if (!el.phonecode.startsWith('+')) {
        // countries = el;
        console.log(`--------`);
        console.log(`--------`);
        console.log(`--------`);
        console.log(`--------`);
        console.log(`--------`);
        console.log(el);
        countries1.push(el);
      }
      console.log(`hey`);
    });
    // console.log(countries);
    res.status(200).json({
      status: 'sucess',
      result: countries1.length - 1,
      // countries,
      countries1,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};

exports.getAllState = async (req, res) => {
  try {
    let state1 = req.params.state;
    // state1 = 'IN';
    console.log(state.getStatesOfCountry(state1));
    let states = state.getStatesOfCountry(state1);
    res
      .status(200)
      .json({ status: 'sucess', result: states.length - 1, states });
  } catch (err) {
    res.status(400).json({
      status: 'fail',

      message: `Error:${err.message}`,
    });
  }
};

exports.getAllCities = async (req, res) => {
  try {
    let cities = req.params.cities;
    // cities = 'KL';
    console.log(city.getCitiesOfCountry('IN'));
    let citiesResult = city.getCitiesOfCountry('IN');
    let citiesResultStore = [];
    // citiesResult = city.getCitiesOfState('Manitoba');
    citiesResult.forEach((el) => {
      if (el.stateCode === req.params.cities) {
        citiesResultStore.push(el);
      }
    });
    res.status(200).json({
      status: 'sucess',
      result: citiesResultStore.length - 1,
      citiesResultStore,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
