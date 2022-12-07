const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    // host: "smtp.sendgrid.net",
    port: 465,
    auth: {
      user: "gokuljayan494@gmail.com",
      pass: "uchlhvnhqubumqit",
    },
    // auth: {
    //   user: "SG.Qs-NlRm3Q9q-cjrE9DYocQ.AIflIIYJg8AG-kfzsFdcWE4F-Nv-3_BuNjv6GoB--co",
    //   pass: "vnPiLQ^w6LuNi4$123456",
    // },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "driversApp@gmail.com",
    to: options.email,
    subject: options.subject,
    html: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
