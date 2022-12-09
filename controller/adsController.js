let AdsModel = require('../model/adsModel');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public');
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + `ads` + file.originalname);
  },
});
var upload = multer({
  storage: storage,
});

exports.uploadAdsMulter = upload.single('images');

exports.uploadAds = async (req, res) => {
  try {
    console.log(req.file);
    console.log(req.body);
    let images = req.file.filename;
    let ads = await AdsModel.create({ agency: req.body.agency, images });
    console.log(ads);
    res.status(200).json({ status: 'sucess', ads });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};

exports.getAds = async (req, res) => {
  try {
    let ads = await AdsModel.find();
    res.status(200).json({ status: 'sucess', ads });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: `Error:${err.message}` });
  }
};
