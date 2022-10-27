var express = require("express");
var router = express.Router();
var User = require("../models/nUsers");
var Agent = require("../models/aUsers");
var Swal = require("sweetalert2");
// var transporter = require("../models/emailVerification");
var crypto = require("crypto");
var cookie = require("cookie-parser");
var jwt = require("jsonwebtoken");
// var nodemailer = require("nodemailer");
var randomString = require("randomstring");
// const SMTPConnection = require("nodemailer/lib/smtp-connection");
var config = require("../config/config");

var sendResetPasswordMail = require("../models/emailVerification");

var Post = require("../models/agent-postadd");
var multer = require("multer");
var upload = multer({ dest: "public/images/testimonials" });

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

const userAuthOut = function (req, res) {
  if (req.session.destroy) {
    res.redirect("/");
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
router.get(
  "/nsignup",
  config.upload.single("normalImage"),
  function (req, res) {
    res.render("users/normalUsers/nuserSignUp");
  }
);

//normal users sign up data
router.post("/nsignup", function (req, res) {
  try {
    const { normalName, normalEmail, normalPassword, normalImage } = req.body;
    var user = new User({
      normalName,
      normalEmail,
      normalImage,
      normalPassword,
      normalemailToken: crypto.randomBytes(64).toString("hex"),
      normalisVerified: false,
    });

    const newUser = user.save();
    exports.contactForm = (req, res) => {
      const { normalName, normalEmail } = req.body;
    };
    res.redirect("/users/nlogin");
  } catch (err) {
    console.log(err);
  }
});

// for resetPassword send mail

// router.use(
//   (sendResetPasswordMail = async (normalName, normalEmail, token) => {
//     try {
//       const transporter = nodemailer.createTransport({
//         service: "Gmail",
//         auth: {
//           user: config.Useremail,
//           pass: config.UserPassword,
//         },
//       });
//       const mailOptions = {
//         from: config.UserEmail,
//         to: user.normalEmail,
//         subject: "For reset password",
//         html:
//           "<p>Hi " +
//           normalName +
//           ', Please click here to <a href="https://127.0.0.1:4000/users/forget-password?token=' +
//           token +
//           '">Reset Your Password</a></p>',
//       };
//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log("Email has been sent:- ", info.response);
//         }
//       });
//     } catch (error) {
//       console.log(error.message);
//     }
//   })
// );

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
  const data = User.findOne(
    { normalEmail: req.body.normalEmail },
    function (err, rtn) {
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
        res.render("users/normalUsers/nuserLogin", {
          message: "တစ်စုံတစ်ရာ မှားယွင်းနေပါသည် ။ အကောင့်ပြန်ဝင်ပါ ။",
        });
      }
    }
  );
});

// normal user profile
router.get("/nprofile", userAuth, function (req, res) {
  res.render("users/normalUsers/nuser-profile.ejs");
});

// normal user reset password
router.get("/forget-password", function (req, res) {
  res.render("users/normalUsers/resetPassword");
});

// normal user forget password
router.get("/nforgetpassword", function (req, res) {
  res.render("users/normalUsers/nUserforgotPassword");
});

// router.get("/nforgetpassword", forgetLoad);

// todo normal user forget password data

router.post("/nforgetpassword", async (req, res) => {
  try {
    const normalEmail = req.body.normalEmail;
    console.log("User Input Data :", normalEmail);
    User.findOne({ normalEmail: normalEmail }, (err, rtn) => {
      if (err) throw err;
      console.log("UserDate :", rtn);
      if (rtn != null) {
        if (rtn.normalisVerified === false) {
          res.render("users/normalUsers/resetPassword", {
            message: "သင့် အီးမေးလ် အတည်ပြုပါ ။",
          });
        } else {
          const randomString = randomString.generate();
          const updatedDate = User.updateOne(
            { normalEmail: normalEmail },
            { $set: { token: randomString } }
          );
          // /nUserforgotPassword
          sendResetPasswordMail(rtn.normalName, rtn.normalEmail, randomString);
          res.render("users/normalUsers/resetPassword", {
            message: "သင့် အီးမေးလ် ကို ကျေးဇူးပြု၍စစ်ပေးပါ ။",
          });
        }
      } else {
        res.render("users/normalUsers/resetPassword", {
          message: " သင့် အီးမေးလ် မှားနေပါသည် ။",
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
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
      res.render("users/agentUsers/agentLogin", {
        message: "တစ်စုံတစ်ရာ မှားယွင်းနေပါသည် ။ အကောင့်ပြန်ဝင်ပါ ။",
      });
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

//agent-post-list
router.get("/apostlist", agentAuth, function (req, res) {
  res.render("users/agentUsers/agent-post-list");
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

// postadd get method
// router.get("/agentpage#contact"),
//   agentAuth,
//   function (req, res) {
//     res.render("/users/agentUsers/agentLogin");
//   };

router.post("/users/agentpage"),
  agentAuth,
  upload.single("image"),
  function (req, res) {
    var post = new Post();
    post.title = req.body.title;
    post.place = req.body.place;
    post.image = req.body.image;
    post.author = req.session.user.id;
    post.content = req.body.content;
    post.created = Date.now();
    if (req.file) post.image = "/images/portfolio/" + req.file.filename;
    post.save(function (err, rtn) {
      if (err) throw err;
      console.log(rtn);
      res.redirect("/");
    });
  };

//   router.get("/users/agentpage"),agentAuth,fuction(req,res){
//     Post.find({author: req.session.user.id},function(err,rtn){
//       if(err) throw err;
//       console.log(rtn);
//       res.render("users/agentpage#portfolio",{posts:rtn});
//     })
//

module.exports = router;
