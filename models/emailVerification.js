var nodemailer = require("nodemailer")
var config = require("../config/config")
var user = require("../models/nUsers")
const sendResetPasswordMail = async (normalName, normalEmail, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: config.Useremail,
        pass: config.UserPassword,
      },
    })
    const mailOptions = {
      from: config.UserEmail,
      to: user.normalEmail,
      subject: "For reset password",
      html:
        "<p>Hi " +
        normalName +
        ', Please click here to <a href="https://127.0.0.1:4000/users/forget-password?token=' +
        token +
        '">Reset Your Password</a></p>',
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log("Email has been sent:- ", info.response)
      }
    })
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = sendResetPasswordMail
