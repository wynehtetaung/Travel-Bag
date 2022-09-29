var nodemailer = require("nodemailer");

var verificationEmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "travelbagproject30@gmail.com",
    pass: "travel#2022bag",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = verificationEmail;
