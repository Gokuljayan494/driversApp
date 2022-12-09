const mongoose = require('mongoose');
const adsSchema = mongoose.Schema({
  agency: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },
});

const AdsModel = mongoose.model('Ad', adsSchema);
module.exports = AdsModel;
