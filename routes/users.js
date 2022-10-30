var express = require("express")
var router = express.Router()
var User = require("../models/nUsers")
var Agent = require("../models/aUsers")
var Post = require("../models/agent-postadd")
var Swal = require("sweetalert2")
// var transporter = require("../models/emailVerification");
var crypto = require("crypto")
var cookie = require("cookie-parser")
var jwt = require("jsonwebtoken")
var nodemailer = require("nodemailer")
// var randomString = require("randomstring")
const SMTPConnection = require("nodemailer/lib/smtp-connection")

// var sendResetPasswordMail = require("../models/emailVerification")

var Post = require("../models/agent-postadd")
var multer = require("multer")
var upload = multer({ dest: "public/images/testimonials" })

var dotenv = require("dotenv")
dotenv.config()
const agentAuth = function (req, res, next) {
  if (req.session.agent) {
    next()
  } else {
    res.redirect("/users/agentLogin")
  }
}
const userAuth = function (req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.redirect("/users/nlogin")
  }
}
/* GET users listing. */
router.get("/", userAuth, function (req, res, next) {
  res.redirect("/users/dashboard")
})

// for send verify mail
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
    })

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

//normal users sign up
router.get("/nsignup", function (req, res) {
  res.render("users/normalUsers/nuserSignUp")
})

//normal users sign up data
router.post("/nsignup", function (req, res) {
  try {
    const { normalName, normalEmail, normalPassword } = req.body
    var user = new User({
      normalName,
      normalEmail,
      normalPassword,
      normalisVerified: false,
    })

    const newUser = user.save()

    if (newUser) {
      sendVerifyMail(req.body.normalName, req.body.normalEmail, user._id)
      res.render("users/normalUsers/nuserSignUp", {
        message:
          "အကောင့် ပြုလုပ်ခြင်းအောင်မြင်ပါသည်။ သင့် အီးမေးလ် သို့အတည်ပြုမေးလ် ပို့ပေးထားပါသည်။ အတည်ပြု၍  အကောင့်ဝင်ပါ။",
      })
    } else {
      res.render("users/normalUsers/nuserSignUp", {
        message: "အကောင့်ဝင်ခြင်း မအောင်မြင်ပါ။",
      })
    }

    // res.redirect("/users/nlogin");
  } catch (err) {
    console.log(err)
  }
})

const verifyMail = async (req, res) => {
  try {
    const updateInfo = await User.updateOne(
      { _id: req.query.id },
      { $set: { normalisVerified: true } }
    )
    console.log("UpdateInfo :", updateInfo)
    res.render("users/normalUsers/verify")
  } catch (error) {
    console.log(error.message)
  }
}

router.get("/verify", verifyMail, function (req, res) {
  res.render("users/normalUsers/verify")
})

// for resetPassword send mail

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
    })
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

// normal users login
router.get("/nlogin", function (req, res) {
  res.render("users/normalUsers/nuserLogin")
})

// normal users login data
router.post("/nlogin", function (req, res) {
  User.findOne({ normalEmail: req.body.normalEmail }, function (err, rtn) {
    if (err) throw err
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
      }
      res.redirect("/dashboard")
    } else if (rtn.normalisVerified === false) {
      res.render("users/normalUsers/nuserLogin", {
        message: "ကျေးဇူးပြု၍ သင့် အီးမေးလ် အတည်ပြုပါ။",
      })
    } else {
      res.render("users/normalUsers/nuserLogin", {
        message: "တစ်စုံတစ်ရာ မှားယွင်းနေပါသည်။ အကောင့်ပြန်ဝင်ပါ ။",
      })
    }
  })
})

// normal user profile
router.get("/nprofile", userAuth, function (req, res) {
  res.render("users/normalUsers/nuser-profile.ejs")
})

// normal user reset password
router.get("/reset-password", function (req, res) {
  res.render("users/normalUsers/resetPassword")
})

// normal user forget password
router.get("/nforgetpassword", function (req, res) {
  res.render("users/normalUsers/nUserforgotPassword")
})

// normal user change password
router.get("/normal-change-password", function (req, res) {
  res.render("users/normalUsers/changepassword")
})

// router.get("/nforgetpassword", forgetLoad);

// todo normal user forget password data

router.post("/nforgetpassword", async (req, res) => {
  try {
    const normalEmail = req.body.normalEmail
    // console.log("User Input Data :", normalEmail)
    User.findOne({ normalEmail: normalEmail }, (err, rtn) => {
      if (err) throw err
      // console.log("UserDate :", rtn)
      if (rtn != null) {
        if (rtn.normalisVerified === false) {
          res.render("users/normalUsers/nUserforgotPassword", {
            message: "သင့် အီးမေးလ် အတည်ပြုပါ။",
          })
        } else {
          // const randomString = randomString.generate()
          const updatedDate = User.updateOne(
            { normalEmail: normalEmail }
            // { $set: { token: randomString } }
          )
          console.log(updatedDate)
          // /nUserforgotPassword
          sendResetPasswordMail(rtn.normalName, rtn.normalEmail)
          res.render("users/normalUsers/nUserforgotPassword", {
            message: "သင့် အီးမေးလ် ကို ကျေးဇူးပြု၍စစ်ပေးပါ။",
          })
        }
      } else {
        res.render("users/normalUsers/nUserforgotPassword", {
          message: " သင့် အီးမေးလ် မှားနေပါသည်။",
        })
      }
    })
  } catch (error) {
    console.log(error.message)
  }
})

// agent sign up
router.get("/agentSignup", function (req, res) {
  res.render("users/agentUsers/agentSignup")
})

// agent sign up data
router.post("/agentSignup", function (req, res) {
  try {
    const { agentName, agentEmail, agentPassword } = req.body
    var user = new Agent({
      agentName,
      agentEmail,
      agentPassword,
      agentemailToken: crypto.randomBytes(64).toString("hex"),
      agentisVerified: false,
    })
    const newUser = user.save()
    console.log("NewUser:", newUser)

    res.redirect("/users/agentLogin")
  } catch (err) {
    console.log(err)
  }
})

// agent Login
router.get("/agentLogin", function (req, res) {
  res.render("users/agentUsers/agentLogin")
})

// agent login data
router.post("/agentLogin", function (req, res) {
  Agent.findOne({ agentEmail: req.body.agentEmail }, function (err, rtn) {
    if (err) throw err
    if (
      rtn != null &&
      Agent.compare(req.body.agentPassword, rtn.agentPassword)
    ) {
      //renember login
      req.session.agent = {
        id: rtn._id,
        agentName: rtn.agentName,
        agentEmail: rtn.agentEmail,
      }
      res.redirect("/users/agentpage")
    } else {
      res.render("users/agentUsers/agentLogin", {
        message: "တစ်စုံတစ်ရာ မှားယွင်းနေပါသည်။ အကောင့်ပြန်ဝင်ပါ ။",
      })
    }
  })
})

// agent index
router.get("/agentpage", agentAuth, function (req, res) {
  res.render("users/agentUsers/agentindex")
})

// agent forget password
router.get("/aforgetpassword", function (req, res) {
  res.render("users/agentUsers/forget-password")
})

// agent change password
router.get("/agent-change-password", function (req, res) {
  res.render("users/agentUsers/changePassword")
})

//agent reset password
router.get("/agent-reset-password", function (req, res) {
  res.render("users/agentUsers/agentResetpassword")
})

//logout

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err
    res.redirect("/")
  })
})

// postadd get method

router.get("/apostadd", agentAuth, function (req, res) {
  res.render("users/agentUsers/agent-post-add")
})

router.post(
  "/apostadd",
  agentAuth,
  upload.single("image"),
  function (req, res) {
    var post = new Post()
    post.title = req.body.title
    post.place = req.body.place
    post.author = req.session.agent.id
    post.content = req.body.content
    post.created = Date.now()
    if (req.file) post.image = "/images/testimonials/" + req.file.filename
    post.save(function (err, rtn) {
      if (err) throw err
      console.log(rtn)
      res.redirect("/users/apostlist")
    })
  }
)

// for post list
router.get("/apostlist", agentAuth, function (req, res) {
  Post.find({ author: req.session.agent.id }, function (err, rtn) {
    if (err) throw err
    res.render("users/agentUsers/agent-post-list", { posts: rtn })
  })
})

//for post detail
router.get("/adetail/:id", agentAuth, function (req, res) {
  Post.findById(req.params.id, function (err, rtn) {
    if (err) throw err
    res.render("users/agentUsers/agent-post-details", { posts: rtn })
  })
})

// agent-profile-detail
router.get("/aprofile", agentAuth, function (req, res) {
  res.render("users/agentUsers/agent-profile-detail")
})

// check users name duplicate
router.post("/checkname", function (req, res) {
  User.findOne({ normalName: req.body.normalName }, function (err, rtn) {
    if (err) {
      res.json({
        message: "Internal server error",
        status: "error",
      })
    } else {
      res.json({
        status: rtn != null ? "username have" : "username no have",
      })
    }
  })
})

// check users emalil duplicate

router.post("/checknemail", function (req, res) {
  User.findOne({ normalEmail: req.body.normalEmail }, function (err, rtn) {
    if (err) {
      res.json({
        message: "Internal server error",
        status: "error",
      })
    } else {
      res.json({
        status: rtn != null ? "have" : "no have",
      })
    }
  })
})

// check agent email duplicate
router.post("/checkagentemail", function (req, res) {
  Agent.findOne({ agentEmail: req.body.agentEmail }, function (err, rtn) {
    if (err) {
      res.json({
        message: "Internal server error",
        status: "error",
      })
    } else {
      res.json({
        status: rtn != null ? "have" : "no have",
      })
    }
  })
})

// check agent name duplicate
router.post("/checkagentname", function (req, res) {
  Agent.findOne({ agentName: req.body.agentName }, function (err, rtn) {
    if (err) {
      res.json({
        message: "Internal server error",
        status: "error",
      })
    } else {
      res.json({
        status: rtn != null ? "already name" : "no have name",
      })
    }
  })
})

module.exports = router
