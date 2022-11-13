var express = require("express");
var router = express.Router();
var User = require("../models/nUsers");
var Agent = require("../models/aUsers");
var Post = require("../models/agent-postadd");
var Swal = require("sweetalert2");
var bcrypt = require("bcryptjs");
var crypto = require("crypto");
var cookie = require("cookie-parser");
var jwt = require("jsonwebtoken");
var fs = require("fs");
var nodemailer = require("nodemailer");
const SMTPConnection = require("nodemailer/lib/smtp-connection");
var multer = require("multer");
var upload = multer({ dest: "public/images/testimonials" });
// var upload2 = multer({ dest: "public/images/portfolio" });

var dotenv = require("dotenv");
const { token } = require("morgan");
const { url } = require("inspector");
const { updateOne } = require("../models/nUsers");
dotenv.config();
const agentAuth = function (req, res, next) {
  if (req.session.agent) {
    next();
    console.log(req.session.agent.agentName);
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

// for normal send verify mail
const sendVerifyMail = async (normalName, normalEmail, User_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    const mailOptions = {
      from: "Travel Bag<process.env.USER_EMAIL>",
      to: normalEmail,
      subject: "For Email Verification",
      html:
        "<p>Hi " +
        normalName +
        ',Travel Bag ကိုအသုံးပြုသည့်အတွက် ကျေးဇူးအထူးတင်ပါသည်။,<br />သင့်အကောင့် အတည်ပြုရန် <a href="http://127.0.0.1:4000/users/verify?id=' +
        User_id +
        '">အတည်ပြုမည်.</a> ကိုနှိပ်ပါ။</p>',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

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

      normalisVerified: false,
    });

    const newUser = user.save();

    if (newUser) {
      sendVerifyMail(req.body.normalName, req.body.normalEmail, user._id);
      res.render("users/normalUsers/nuserSignUp", {
        message:
          "အကောင့် ပြုလုပ်ခြင်းအောင်မြင်ပါသည်။ သင့် အီးမေးလ် သို့အတည်ပြုမေးလ် ပို့ပေးထားပါသည်။ အတည်ပြု၍  အကောင့်ဝင်ပါ။",
      });
    } else {
      res.render("users/normalUsers/nuserSignUp", {
        message: "အကောင့်ဝင်ခြင်း မအောင်မြင်ပါ။",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

const verifyMail = async (req, res) => {
  try {
    const updateInfo = await User.updateOne(
      { _id: req.query.id },
      { $set: { normalisVerified: true } }
    );
    console.log("UpdateInfo :", updateInfo);
    res.render("users/normalUsers/verify");
  } catch (error) {
    console.log(error.message);
  }
};

router.get("/verify", verifyMail, function (req, res) {
  res.render("users/normalUsers/verify");
});

// for normal_User resetPassword send mail

const sendResetPasswordMail = async (normalName, normalEmail, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });
    const mailOptions = {
      from: "Travel Bag<process.env.USER_EMAIL>",
      to: normalEmail,
      subject: "For reset password",
      html:
        "<p>Hi " +
        normalName +
        ', သင့်စကားဝှက်အသစ် ပြန်လုပ်ရန် အတွက်<a href="http://127.0.0.1:4000/users/reset-password?token=' +
        token +
        '">စကားဝှက်ပြောင်းလဲမည်</a>ကိုနှိပ်ပါ။</p>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

// normal users login
router.get("/nlogin", function (req, res) {
  res.render("users/normalUsers/nuserLogin");
});

// normal users login data
router.post("/nlogin", function (req, res) {
  User.findOne({ normalEmail: req.body.normalEmail }, function (err, rtn) {
    if (err) throw err;
    if (rtn == null) {
      res.render("users/normalUsers/nuserLogin", {
        message: "တစ်စုံတစ်ရာ မှားယွင်းနေပါသည်။ အကောင့်ပြန်ဝင်ပါ ။",
      });
    } else {
      if (rtn.normalisact_ban == true) {
        if (
          rtn.normalisVerified === true &&
          rtn != null &&
          User.compare(req.body.normalPassword, rtn.normalPassword)
          // User.compare(req.body.normalisVerified, rtn.normalisVerified)
        ) {
          //renember login
          req.session.user = {
            id: rtn._id,
            normalName: rtn.normalName,
            normalEmail: rtn.normalEmail,
          };
          res.redirect("/dashboard");
        } else if (rtn.normalisVerified === false) {
          res.render("users/normalUsers/nuserLogin", {
            message: "ကျေးဇူးပြု၍ သင့် အီးမေးလ် အတည်ပြုပါ။",
          });
        } else {
          res.render("users/normalUsers/nuserLogin", {
            message: "တစ်စုံတစ်ရာ မှားယွင်းနေပါသည်။ အကောင့်ပြန်ဝင်ပါ။",
          });
        }
      } else {
        res.render("users/normalUsers/nuserLogin", {
          message: "တစ်စုံတစ်ရာ မှားယွင်းနေပါသည့်အတွက် ၇ ရက် ပိတ်ပင်ထားပါသည်။ ",
        });
      }
    }
  });
});

// normal user profile
router.get("/nprofile", userAuth, function (req, res) {
  res.render("users/normalUsers/nuser-profile.ejs");
});

// normal user reset password
router.get("/reset-password", function (req, res) {
  res.render("users/normalUsers/resetPassword");
});

router.post("/reset-password", function (req, res) {
  // console.log("token:", req.query.token);
  User.findOne({ normalEmail: req.body.normalEmail }, async (err, rtn) => {
    console.log("rtnToke:", rtn);
    if (err) throw err;
    if (rtn == null) {
      res.render("users/normalUsers/resetPassword", {
        message: "သင်အကောင့်ဖွင့်ထားသော အီးမေးလ်ထည့်ပါ။",
      });
    } else {
      if (rtn.normalEmail == req.body.normalEmail) {
        console.log("pass:", rtn.normalPassword);
        const resetpass = bcrypt.hashSync(
          req.body.normalNewPass,
          bcrypt.genSaltSync(8),
          null
        );
        const fcp = await User.updateOne(
          { normalEmail: req.body.normalEmail },
          { $set: { normalPassword: resetpass } }
        );
        console.log(fcp);
        console.log("new:", rtn.normalPassword);
        res.redirect("/users/nlogin");
      }
    }
  });
});

// normal user forget password
router.get("/nforgetpassword", function (req, res) {
  res.render("users/normalUsers/nUserforgotPassword");
});

// normal user change password
router.get("/normal-change-password", function (req, res) {
  res.render("users/normalUsers/changepassword");
});

router.post("/normal-change-password", function (req, res) {
  User.findOne({ normalEmail: req.body.normalEmail }, async (err, rtn) => {
    if (err) throw err;
    if (rtn == null) {
      res.render("users/normalUsers/changepassword", {
        message: "သင့်အီးမေးလ်မှားနေပါသည်။ အကောင့်ဖွင့်ထားသောအီးမေးလ်ထည့်ပါ။",
      });
    } else {
      if (
        req.body.normalEmail == rtn.normalEmail &&
        User.compare(req.body.normalOldPassword, rtn.normalPassword)
      ) {
        const nPass = bcrypt.hashSync(
          req.body.normalNewPassword,
          bcrypt.genSaltSync(8),
          null
        );
        const complete = await User.updateOne(
          { normalEmail: req.body.normalEmail },
          { $set: { normalPassword: nPass } }
        );
        console.log("complete :", complete);
        res.redirect("/users/nlogin");
      } else {
        res.render("users/normalUsers/changepassword", {
          message: "သင့်စကားဝှက်အဟောင်းမှားနေပါသည်။",
        });
      }
    }
  });
});

//  normal user forget password data

router.post("/nforgetpassword", async (req, res) => {
  try {
    const normalEmail = req.body.normalEmail;
    User.findOne({ normalEmail: normalEmail }, (err, rtn) => {
      if (err) throw err;
      if (rtn != null) {
        if (rtn.normalisVerified === false) {
          // console.log("find:", User.findById(normalEmail));
          res.render("users/normalUsers/nUserforgotPassword", {
            message: "သင့် အီးမေးလ် အတည်ပြုပါ။",
          });
        } else {
          const nanoid = rtn.token;
          console.log("ID:", rtn.token);
          sendResetPasswordMail(rtn.normalName, rtn.normalEmail, nanoid);
          res.render("users/normalUsers/nUserforgotPassword", {
            message: "သင့်အီးမေးလ်ကို မေးလ်ပို့တားပါသည်။ကျေးဇူးပြု၍စစ်ပေးပါ။",
          });
        }
      } else {
        res.render("users/normalUsers/nUserforgotPassword", {
          message: " သင့် အီးမေးလ် မှားနေပါသည်။",
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

// agent send verify mail

const agentSendVerifyMail = async (agentName, agentEmail, User_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    const mailOptions = {
      from: "Travel Bag<process.env.USER_EMAIL>",
      to: agentEmail,
      subject: "For Email Verification",
      html:
        "<p>Hi " +
        agentName +
        ',Travel Bag ကိုအသုံးပြုသည့်အတွက် ကျေးဇူးအထူးတင်ပါသည်။,<br />သင့်အကောင့် အတည်ပြုရန် <a href="http://127.0.0.1:4000/users/agent-verify?id=' +
        User_id +
        '">အတည်ပြုမည်.</a> ကိုနှိပ်ပါ။</p>',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

// agent sign up data
router.post("/agentSignup", function (req, res) {
  try {
    const {
      agentName,
      agentEmail,
      agentPassword,
      agentBio,
      agentPhone,
      agentCity,
    } = req.body;
    var user = new Agent({
      agentName,
      agentEmail,
      agentPassword,
      agentBio,
      agentPhone,
      agentCity,
      agentisVerified: false,
    });

    const agentUser = user.save();
    console.log("NewUser :", agentUser);

    if (agentUser) {
      agentSendVerifyMail(req.body.agentName, req.body.agentEmail, user._id);
      res.render("users/agentUsers/agentSignup", {
        message:
          "သင့် အီးမေးလ် သို့အတည်ပြုမေးလ် ပို့ပေးထားပါသည်။ ကျေးဇူးပြု၍ အတည်ပြုပေးပါ။",
      });
    } else {
      res.render("users/agentUsers/agentSignup", {
        message: "အကောင့်ဝင်ခြင်း မအောင်မြင်ပါ။",
      });
    }

    // res.redirect("/users/agentLogin");
  } catch (error) {
    console.log(error);
  }
});

router.get("/agentLogin", function (req, res) {
  res.render("users/agentUsers/agentLogin");
});
router.post("/agentLogin", function (req, res) {
  Agent.findOne({ agentEmail: req.body.agentEmail }, function (err, rtn) {
    if (err) throw err;
    if (rtn == null) {
      res.render("users/agentUsers/agentLogin", {
        message: "တစ်စုံတစ်ရာ မှားယွင်းနေပါသည်။ အကောင့်ပြန်ဝင်ပါ ။",
      });
    } else {
      if (rtn.normalisact_ban == true) {
        if (
          rtn.agentisVerified === true &&
          rtn != null &&
          Agent.compare(req.body.agentPassword, rtn.agentPassword)
        ) {
          req.session.agent = {
            id: rtn._id,
            agentName: rtn.agentName,
            agentEmail: rtn.agentEmail,
          };
          res.redirect("/users/agentpage");
        } else if (rtn.agentisVerified === false) {
          res.render("users/agentUsers/agentLogin", {
            message: "ကျေးဇူးပြု၍ သင့် အီးမေးလ် အတည်ပြုပါ။",
          });
        } else {
          res.render("users/agentUsers/agentLogin", {
            message: "တစ်စုံတစ်ရာ မှားယွင်းနေပါသည်။ အကောင့်ပြန်ဝင်ပါ။",
          });
        }
      } else {
        res.render("users/agentUsers/agentLogin", {
          message:
            "website နှင့်မသက်ဆိုင်သော post  များတင်သောကြောင့် ၇ ရက်ပိတ်ပင်ထားပါသည်။",
        });
      }
    }
  });
});

const agentVerifyMail = async (req, res) => {
  try {
    const agentupdateInfo = await Agent.updateOne(
      { _id: req.query.id },
      { $set: { agentisVerified: true } }
    );
    console.log("UpdateInfo :", agentupdateInfo);
    res.render("users/agentUsers/verify");
  } catch (error) {
    console.log(error.message);
  }
};

// agent verify
router.get("/agent-verify", agentVerifyMail, function (req, res) {
  res.render("users/agentUsers/verify");
});

// agent index
router.get("/agentpage", agentAuth, function (req, res) {
  // Agent.findById(req.params.id)
  //   .populate("author", "agentName agentPhone")
  //   .exec(function (err, rtn) {
  //     if (err) throw err;
  //     res.render("users/normalUsers/post-detail", { blog: rtn });
  //   });
  Agent.findOne({ id: req.session.agent.id }, function (err, rtn) {
    if (err) throw err;
    res.render("users/agentUsers/agentindex", { ausers: rtn });
  });
});

// agent forget password send email

const agentSendResetPasswordMail = async (
  agentName,
  agentEmail,
  agenttoken
) => {
  console.log("email", agentEmail);
  try {
    const transporter = nodemailer.createTransport({
      // smtpTransport('smtps://contact%40example.com:mypassword@smtp.example.com'),
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      // requireTLS: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        // ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: "Travel Bag<process.env.USER_EMAIL>",
      to: agentEmail,
      subject: "For reset password",
      html:
        "<p>Hi " +
        agentName +
        ', သင့်စကားဝှက်အသစ် ပြန်လုပ်ရန် အတွက်<a href="http://127.0.0.1:4000/users/agent-reset-password?token=' +
        agenttoken +
        '">စကားဝှက်ပြောင်းလဲမည်</a>ကိုနှိပ်ပါ။</p>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

// agent forget password
router.get("/aforgetpassword", function (req, res) {
  res.render("users/agentUsers/forget-password");
});

router.post("/aforgetpassword", async (req, res) => {
  try {
    const agentEmail = req.body.agentEmail;
    Agent.findOne({ agentEmail: agentEmail }, (err, rtn) => {
      if (err) throw err;
      if (rtn != null) {
        if (rtn.agentisVerified === false) {
          res.render("users/agentUsers/forget-password", {
            message: "သင့် အီးမေးလ် အတည်ပြုပါ။",
          });
        } else {
          const nanoid = rtn.agenttoken;
          console.log("ID:", rtn.agenttoken);
          agentSendResetPasswordMail(rtn.agentName, rtn.agentEmail, nanoid);
          res.render("users/agentUsers/forget-password", {
            message: "သင့်အီးမေးလ်ကို မေးလ်ပို့တားပါသည်။ကျေးဇူးပြု၍စစ်ပေးပါ။",
          });
        }
      } else {
        res.render("users/agentUsers/forget-password", {
          message: " သင့် အီးမေးလ် မှားနေပါသည်။",
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
});

// agent change password
router.get("/agent-change-password", function (req, res) {
  res.render("users/agentUsers/changePassword");
});

router.post("/agent-change-password", function (req, res) {
  Agent.findOne({ agentEmail: req.body.agentEmail }, async (err, rtn) => {
    if (err) throw err;
    if (rtn == null) {
      res.render("users/agentUsers/changePassword", {
        message: "သင့်အီးမေးလ်မှားနေပါသည်။ အကောင့်ဖွင့်ထားသောအီးမေးလ်ထည့်ပါ။",
      });
    } else {
      if (
        req.body.agentEmail == rtn.agentEmail &&
        Agent.compare(req.body.agentOldPassword, rtn.agentPassword)
      ) {
        const anPass = bcrypt.hashSync(
          req.body.agentNewPassword,
          bcrypt.genSaltSync(8),
          null
        );
        const acomplete = await Agent.updateOne(
          { agentEmail: req.body.agentEmail },
          { $set: { agentPassword: anPass } }
        );
        console.log("complete :", acomplete);
        res.redirect("/users/agentLogin");
      } else {
        res.render("users/agentUsers/changePassword", {
          message: "သင့်စကားဝှက်အဟောင်းမှားနေပါသည်။",
        });
      }
    }
  });
});

//agent reset password
router.get("/agent-reset-password", function (req, res) {
  res.render("users/agentUsers/agentResetpassword");
});

router.post("/agent-reset-password", function (req, res) {
  Agent.findOne({ agentEmail: req.body.agentEmail }, async (err, rtn) => {
    // console.log("query", req.query);
    if (err) throw err;
    if (rtn == null) {
      res.render("users/agentUsers/agentResetpassword", {
        message: "သင်အကောင့်ဖွင့်ထားသော အီးမေးလ်ထည့်ပါ။",
      });
    } else {
      if (rtn.agentEmail == req.body.agentEmail) {
        console.log("pass:", rtn.agentPassword);
        const agentresetpass = bcrypt.hashSync(
          req.body.agentNewPassword,
          bcrypt.genSaltSync(8),
          null
        );
        const afcp = await Agent.updateOne(
          { agentEmail: req.body.agentEmail },
          { $set: { agentPassword: agentresetpass } }
        );
        console.log("updateDate : ", afcp);
        res.redirect("/users/agentLogin");
      }
    }
  });
});

//logout

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err;
    res.redirect("/");
  });
});

// postadd get method

router.get("/apostadd", agentAuth, function (req, res) {
  res.render("users/agentUsers/agent-post-add");
});

router.post(
  "/apostadd",
  agentAuth,
  upload.single("image"),
  function (req, res) {
    var post = new Post();
    console.log("status:", req.body);
    post.title = req.body.title;
    post.place = req.body.place;
    post.phone = req.body.phone;
    post.author = req.session.agent.id;
    post.content = req.body.content;
    post.created = Date.now();
    post.type = req.body.type;
    if (req.file) post.image = "/images/testimonials/" + req.file.filename;
    post.save(function (err, rtn) {
      if (err) throw err;
      res.redirect("/users/apostlist");
    });
  }
);

// for post list
router.get("/apostlist", agentAuth, function (req, res) {
  Post.find({ author: req.session.agent.id }, function (err, rtn) {
    if (err) throw err;

    res.render("users/agentUsers/agent-post-list", { posts: rtn });
  });
});

//for post detail
router.get("/adetail/:id", agentAuth, function (req, res) {
  Post.findById(req.params.id)
    .populate("author", "agentPhone")
    .exec(function (err, rtn) {
      if (err) throw err;
      res.render("users/agentUsers/agent-post-details", { posts: rtn });
    });
});

//for post update
router.get("/apostupdate/:id", agentAuth, function (req, res) {
  Post.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.render("users/agentUsers/agent-post-update", { posts: rtn });
  });
});

router.post(
  "/apostupdate",
  agentAuth,
  upload.single("image"),
  function (req, res) {
    var update = {
      title: req.body.title,
      content: req.body.content,
      place: req.body.place,
      phone: req.body.phone,
      updated: Date.now(),
    };
    if (req.file) update.image = "/images/testimonials/" + req.file.filename;
    Post.findByIdAndUpdate(req.body.id, { $set: update }, function (err, rtn) {
      if (err) throw err;
      console.log(rtn);
      res.redirect("/users/apostlist");
    });
  }
);

router.post(
  "/apostupdate",
  agentAuth,
  upload.single("image"),
  function (req, res) {
    var update = {
      title: req.body.title,
      content: req.body.content,
      place: req.body.place,
      phone: req.body.phone,
      updated: Date.now(),
    };
    if (req.file) update.image = "/images/testimonials" + req.file.filename;
    Post.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      function (err, rtn) {
        if (err) throw err;
        console.log(rtn);
        res.redirect("/users/apostlist");
      }
    );
  }
);

// agent post delete
router.get("/apostdelete/:id", agentAuth, function (req, res) {
  Post.findByIdAndDelete(req.params.id, function (err, rtn) {
    if (err) throw err;
    console.log("post delete:", rtn);
    fs.unlink("public" + rtn.image, function (err2, rtn2) {
      if (err2) throw err;
      res.redirect("/users/apostlist");
    });
  });
});

// for agent list
router.get("/agentlist", agentAuth, function (req, res) {
  Agent.find({ author: req.session.agent.id }, function (err, rtn) {
    if (err) throw err;
    res.render("users/agentUsers/agent-list", { ausers: rtn });
  });
});

//for agent profile detail
router.get("/aprofile/:id", agentAuth, function (req, res) {
  Agent.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    Post.find({ author: rtn.id }, function (err2, rtn2) {
      if (err2) throw err;
      res.render("users/agentUsers/agent-profile-detail", {
        posts: rtn2,
        ausers: rtn,
      });
    });
  });
});

//for post detail from agent
router.get("/atoadetail/:id", agentAuth, function (req, res) {
  Post.findById(req.params.id)
    .populate("author", "agentPhone")
    .exec(function (err, rtn) {
      if (err) throw err;
      res.render("users/agentUsers/agent-post-detail-fromagent", {
        posts: rtn,
      });
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
