var express = require("express");
var router = express.Router();
var User = require("../models/nUsers");
var Agent = require("../models/aUsers");
// var transporter = require("../models/emailVerification");
var crypto = require("crypto");
var cookie = require("cookie-parser");
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
// const { findById } = require("../models/nUsers");

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

//nodemailer
// var transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "travelbagproject30@gmail.com",
//     pass: "travel#2022bag",
//   },
// });

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
  // let mailTransporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: "travelbagproject30@gmail.com",
  //     pass: "travel#2022bag",
  //   },
  // });

  try {
    // /helpers/email.js

    // var sendEmailWithNodemailer = (req, res, emailData) => {
    //   let transporter = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 587,
    //     secure: false,
    //     requireTLS: true,
    //     auth: {
    //       user: "travelbagproject30@gmail.com", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
    //       pass: "travel#2022bag", // MAKE SURE THIS PASSWORD IS YOUR GMAIL APP PASSWORD WHICH YOU GENERATED EARLIER
    //     },
    //     tls: {
    //       ciphers: "SSLv3",
    //     },
    //   });
    // };

    // return transporter
    // .sendMail(emailData)
    // .then((info) => {
    //   console.log(`Message sent: ${info.response}`);
    //   return res.json({
    //     success: true,
    //   });
    // })
    // .catch((err) => console.log(`Problem sending email: ${err}`));

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
    // mailTransporter.sendMail(mailOptions, function (err, info) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log("verfication mail is sent");
    //   }
    // });

    // controllers/form.js

    exports.contactForm = (req, res) => {
      const { normalName, normalEmail } = req.body;

      //   const emailData = {
      //     from: "travelbagproject30@gmail.com", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      //     to: user.normalEmail, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE YOUR GMAIL
      //     subject: "Website Contact Form",
      //     text: `Email received from contact from \n Sender name: ${normalName} \n Sender email: ${normalEmail} \n`,
      //     html: `
      //     <h4>Email received from contact form:</h4>
      //     <p>Sender name: ${normalName}</p>
      //     <p>Sender email: ${normalEmail}</p>
      //     <hr />
      //     <p>This email may contain sensitive information</p>
      //     <p>https://onemancode.com</p>
      // `,
      //   };

      sendEmailWithNodemailer(req, res, emailData);
    };
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

// normal user profile
router.get("/nprofile", userAuth, function (req, res) {
  res.render("users/normalUsers/nuser-profile.ejs");
});

// normal user forget password
router.get("/nforgetpassword", function (req, res) {
  res.render("users/normalUsers/nUserforgotPassword");
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

// agent-post-detail
router.get("/adetail", agentAuth, function (req, res) {
  res.render("users/agentUsers/agent-post-details");
});

// agent-profile-detail
router.get("/aprofile", agentAuth, function (req, res) {
  res.render("users/agentUsers/agent-profile-detail");
});

// agent forget password
router.get("/aforgetpassword", function (req, res) {
  res.render("users/agentUsers/forget-password");
});

//logout

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err;
    res.redirect("/");
  });
});

// check users name duplicate
router.post("/checkname", function (req, res) {
  User.findOne({ normalName: req.body.normalName }, function (err, rtn) {
    if (err) {
      res.json({
        message: "Internal server error",
        status: "error",
      });
    } else {
      res.json({
        status: rtn != null ? "username have" : "username no have",
      });
    }
  });
});

// check users emalil duplicate

router.post("/checknemail", function (req, res) {
  User.findOne({ normalEmail: req.body.normalEmail }, function (err, rtn) {
    if (err) {
      res.json({
        message: "Internal server error",
        status: "error",
      });
    } else {
      res.json({
        status: rtn != null ? "have" : "no have",
      });
    }
  });
});

// check agent email duplicate
router.post("/checkagentemail", function (req, res) {
  Agent.findOne({ agentEmail: req.body.agentEmail }, function (err, rtn) {
    if (err) {
      res.json({
        message: "Internal server error",
        status: "error",
      });
    } else {
      res.json({
        status: rtn != null ? "have" : "no have",
      });
    }
  });
});

// check agent name duplicate
router.post("/checkagentname", function (req, res) {
  Agent.findOne({ agentName: req.body.agentName }, function (err, rtn) {
    if (err) {
      res.json({
        message: "Internal server error",
        status: "error",
      });
    } else {
      res.json({
        status: rtn != null ? "already name" : "no have name",
      });
    }
  });
});

module.exports = router;
