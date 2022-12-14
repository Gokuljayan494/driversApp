const express = require('express');
const app = express();
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const adminRouter = require('./Routes/adminRouter');
const driverRouter = require('./Routes/driverRouter');
const agencyRouter = require('./Routes/agencyRouter');
const sanitize = require('sanitize');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const country = require('country-state-city');
const csrf = require('csurf');
const multer = require('multer');
const csrfProtection = csrf();
const AWS = require('aws-sdk');
const upload = multer({ dest: 'uploads/' });
// var bodyParser = require(‘body-parser’);
// const app = express()
const countryRouter = require('./Routes/countryRouter');
mongoose.set('strictQuery', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/////////////////////////////////////////
console.log(`api:${process.env.api_key}`);

dotenv.config({ path: './config.env' });
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));

// app.use(express.)
app.use(sanitize.middleware);
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

mongoose
  .connect(
    `mongodb+srv://gokuljayan:${process.env.MONGOOSE_PASSWORD}@cluster0.ilu27pp.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((con) => {
    console.log(`Db connected `);
  })
  .catch((err) => {
    console.log(`Error:${err.message}`);
  });
console.log(process.env.CLOUDINARY_API_SECRET);
// app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});
app.use(`/api/v1/driver`, driverRouter);
app.use(`/api/v1/agency`, agencyRouter);
app.use(`/api/v1/admin`, adminRouter);
app.use('/api/v1/country', countryRouter);

app.listen('3000', () => {
  console.log(`server started at port 3000`);
});
