const express = require("express");
const app = express();
const mongoose = require("mongoose");
const adminRouter = require("./Routes/adminRouter");
const driverRouter = require("./Routes/driverRouter");
const agencyRouter = require("./Routes/agencyRouter");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
/////////////////////////////////////////
dotenv.config({ path: "./config.env" });
app.use(express.urlencoded({ extended: true }));
// app.use(express.)
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
console.log(process.env.NODE_ENV);
mongoose
  .connect(
    `mongodb+srv://gokuljayan:5s7IGmkr3HNFbxbu@cluster0.ilu27pp.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((con) => {
    console.log(`Db connected `);
  })
  .catch((err) => {
    console.log(`Error:${err.message}`);
  });

app.use(`/api/v1/driver`, driverRouter);
app.use(`/api/v1/agency`, agencyRouter);
app.use(`/api/v1/admin`, adminRouter);

app.listen("5000", () => {
  console.log(`server started at port 3000`);
});
