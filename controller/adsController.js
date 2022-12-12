let AdsModel = require('../model/adsModel');
const multer = require('multer');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// cloudinary.config({
//   cloud_name: 'YOUR_CLOUD_NAME',
//   api_key: 'YOUR_API_KEY',
//   api_secret: 'YOUR_API_SECRET',
// });

cloudinary.config({
  cloud_name: 'ddvontprj',
  api_key: '651867513143989',
  api_secret: 'nRV4E2rXZ4Eg9j-SqjUuAejgYR0',
});

let cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  folder: 'Driver APP',
  format: 'mp4',
  resource_type: 'video',
  allowedFormats: ['jpg', 'png', 'jpeg', 'gid', 'pdf', 'mp4'],
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // The file on cloudinary would have the same name as the original file name
  },
});

var upload = multer({
  storage: cloudinaryStorage,
});

exports.uploadAdsMulter = upload.single('images');

exports.uploadAds = async (req, res) => {
  try {
    console.log(`------------------`);
    console.log(`------------------`);
    console.log(`------------------`);
    console.log(`------------------`);
    console.log(`------------------`);

    console.log(`mime:${req.file.mimetype}`);
    let mime = req.file.mimetype.split('/')[1];
    if (mime === 'jpeg' || mime === 'png') {
    }
    console.log(mime);
    let images = req.file.path;
    console.log(req.file);
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

////////////////////////
//...

//...
