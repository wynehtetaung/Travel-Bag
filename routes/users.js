var express = require("express");
var router = express.Router();
var User = require("../models/nUsers");
var Agent = require("../models/aUsers");
var transporter = require("../models/emailVerification");
var crypto = require("crypto");
var cookie = require("cookie-parser");
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
// const { findById } = require("../models/nUsers");
// var bcrypt = require("bcryptjs");

const agentAuth = function (req, res, next) {
  if (req.session.agent) {
    next();
  } else {
    res.redirect("/users/agentLogin");
  }
};
const userAuth = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/users/nlogin");
  }
};

/* GET users listing. */
router.get("/", userAuth, function (req, res, next) {
  res.redirect("/users/dashboard");
});

//normal users sign up
router.get("/nsignup", function (req, res) {
  res.render("users/normalUsers/nuserSignUp");
});

//normal users sign up data
router.post("/nsignup", function (req, res) {
  try {
    const { normalName, normalEmail, normalPassword } = req.body;
    var user = new User({
      normalName,
      normalEmail,
      normalPassword,
      normalemailToken: crypto.randomBytes(64).toString("hex"),
      normalisVerified: false,
    });

    const newUser = user.save();

    // send verification mail to user
    // var mailOptions = {
    //   from: '"Verification your email" <travelbagproject30@gmail.com>',
    //   to: user.normalEmail,
    //   Subject: "code withthis id - verify your email",
    //   html: `<h2>${user.normalName}! Thanks for register on our website.</h2>
    //           <h4> Please verify to continue....</h4>
    //           <a href="localhost:4000/user/verify-email?token=${user.normalemailToken}">verify your email</a>`,
    // };

    // send mail
    // transporter.sendMail(mailOptions, function (err, rtn) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log("Sent to verification mail to your mail");
    //   }
    // });

    console.log("NewUser :", newUser);

    res.redirect("/users/nlogin");
  } catch (err) {
    console.log(err);
  }
});

// normal users login
router.get("/nlogin", function (req, res) {
  res.render("users/normalUsers/nuserLogin");
});

// create token
// var createToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET);
// };

// normal users login data
router.post("/nlogin", function (req, res) {
  User.findOne({ normalEmail: req.body.normalEmail }, function (err, rtn) {
    if (err) throw err;
    if (
      rtn != null &&
      User.compare(req.body.normalPassword, rtn.normalPassword)
    ) {
      //renember login
      req.session.user = {
        id: rtn._id,
        normalName: rtn.normalName,
        normalEmail: rtn.normalEmail,
      };

      //create token
      // var token = createToken(findById);
      // var token = createToken(findeUser.id);
      // console.log(token);

      // store token in cookie
      // res.cookie("access-token", token);

      res.redirect("/dashboard");
    } else {
      res.redirect("/users/nlogin");
    }
  });
});

// agent sign up
router.get("/agentSignup", function (req, res) {
  res.render("users/agentUsers/agentSignup");
});

// agent sign up data
router.post("/agentSignup", function (req, res) {
  try {
    const { agentName, agentEmail, agentPassword } = req.body;
    var user = new Agent({
      agentName,
      agentEmail,
      agentPassword,
      agentemailToken: crypto.randomBytes(64).toString("hex"),
      agentisVerified: false,
    });
    // const salt = new bcrypt.genSalt(10);
    // const hashPassword = bcrypt.hash(user.normalPassword, salt);
    // user.normalPassword = hashPassword;
    const newUser = user.save();
    console.log("NewUser:", newUser);

    res.redirect("/users/agentLogin");
  } catch (err) {
    console.log(err);
  }
});

// agent Login
router.get("/agentLogin", function (req, res) {
  res.render("users/agentUsers/agentLogin");
});

// agent login data
router.post("/agentLogin", function (req, res) {
  Agent.findOne({ agentEmail: req.body.agentEmail }, function (err, rtn) {
    if (err) throw err;
    if (
      rtn != null &&
      Agent.compare(req.body.agentPassword, rtn.agentPassword)
    ) {
      //renember login
      req.session.agent = {
        id: rtn._id,
        agentName: rtn.agentName,
        agentEmail: rtn.agentEmail,
      };

      //create token
      // var token = createToken(findById);
      // var token = createToken(findeUser.id);
      // console.log(token);

      // store token in cookie
      // res.cookie("access-token", token);

      res.redirect("/users/agentpage");
    } else {
      res.redirect("/users/agentLogin");
    }
  });
});

// agent index
router.get("/agentpage", agentAuth, function (req, res) {
  res.render("users/agentUsers/agentindex");
});

//logout

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err;
    res.redirect("/");
  });
});

module.exports = router;
