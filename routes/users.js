<<<<<<< HEAD
var express = require('express')
var router = express.Router()
var User = require('../models/nUsers')
var Agent = require('../models/aUsers')
var Post = require('../models/agent-postadd')
var Swal = require('sweetalert2')
// var transporter = require("../models/emailVerification");
var crypto = require('crypto')
var cookie = require('cookie-parser')
var jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer')
var randomString = require('randomstring')
const SMTPConnection = require('nodemailer/lib/smtp-connection')
var config = require('../config/config')

var sendResetPasswordMail = require('../models/emailVerification')

var multer = require('multer')
var upload = multer({ dest: 'public/images/testimonials' })

var dotenv = require('dotenv')
dotenv.config()
console.log(
  process.env.USER_EMAIL,
  process.env.PASSWORD,
  typeof process.env.USER_EMAIL,
  typeof process.env.PASSWORD
)
=======
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
var randomString = require("randomstring")
const SMTPConnection = require("nodemailer/lib/smtp-connection")

var sendResetPasswordMail = require("../models/emailVerification")

var Post = require("../models/agent-postadd")
var multer = require("multer")
var upload = multer({ dest: "public/images/testimonials" })

var dotenv = require("dotenv")
dotenv.config()
// console.log(
//   process.env.USER_EMAIL,
//   process.env.PASSWORD,
//   typeof process.env.USER_EMAIL,
//   typeof process.env.PASSWORD
// )
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
const agentAuth = function (req, res, next) {
  if (req.session.agent) {
    next()
  } else {
<<<<<<< HEAD
    res.redirect('/users/agentLogin')
=======
    res.redirect("/users/agentLogin")
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
  }
}
const userAuth = function (req, res, next) {
  if (req.session.user) {
    next()
  } else {
<<<<<<< HEAD
    res.redirect('/users/nlogin')
  }
}

//nodemailer
// var transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "travelbagproject30@gmail.com",
//     pass: "travel#2022bag",
//   },
// });

/* GET users listing. */
router.get('/', userAuth, function (req, res, next) {
  res.redirect('/users/dashboard')
=======
    res.redirect("/users/nlogin")
  }
}
/* GET users listing. */
router.get("/", userAuth, function (req, res, next) {
  res.redirect("/users/dashboard")
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
})

// for send verify mail
const sendVerifyMail = async (normalName, normalEmail, User_id) => {
  try {
    const transporter = nodemailer.createTransport({
      // service: "gmail",
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
      },
    })

    const mailOptions = {
      from: "Travel Bag<process.env.USER_EMAIL>",
      to: normalEmail,
      subject: 'For Email Verification',
      html:
        '<p>Hi ' +
        normalName +
        ', Please click here to <a href="https://127.0.0.1:4000/users/verify?id=' +
        User_id +
        '">verification your mail.</a></p>',
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
<<<<<<< HEAD
        console.log('Email has been sent:- ', info.response)
=======
        console.log("Email has been sent:- ", info.response)
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
      }
    })
  } catch (error) {
    console.log(error.message)
  }
}

//normal users sign up
<<<<<<< HEAD
router.get('/nsignup', function (req, res) {
  res.render('users/normalUsers/nuserSignUp')
=======
router.get("/nsignup", function (req, res) {
  res.render("users/normalUsers/nuserSignUp")
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
})

//normal users sign up data
router.post('/nsignup', function (req, res) {
  try {
    const { normalName, normalEmail, normalPassword } = req.body
    var user = new User({
      normalName,
      normalEmail,
      normalPassword,
<<<<<<< HEAD
      normalemailToken: crypto.randomBytes(64).toString('hex'),
=======
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
      normalisVerified: false,
    })

    const newUser = user.save()

    if (newUser) {
      sendVerifyMail(req.body.normalName, req.body.normalEmail, user._id)
<<<<<<< HEAD
      res.render('users/normalUsers/nuserSignUp', {
        message:
          'အကောင့် ပြုလုပ်ခြင်းအောင်မြင်ပါသည် ။ သင့် အီးမေးလ် သို့အတည်ပြုမေးလ် ပို့ပေးထားပါသည် ။ အတည်ပြု၍  အကောင့်ဝင်ပါ ။',
      })
    } else {
      res.render('users/normalUsers/nuserSignUp', {
        message: 'အကောင့်ဝင်ခြင်း မအောင်မြင်ပါ ။',
=======
      res.render("users/normalUsers/nuserSignUp", {
        message:
          "အကောင့် ပြုလုပ်ခြင်းအောင်မြင်ပါသည်။ သင့် အီးမေးလ် သို့အတည်ပြုမေးလ် ပို့ပေးထားပါသည်။ အတည်ပြု၍  အကောင့်ဝင်ပါ။",
      })
    } else {
      res.render("users/normalUsers/nuserSignUp", {
        message: "အကောင့်ဝင်ခြင်း မအောင်မြင်ပါ။",
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
      })
    }

    // res.redirect("/users/nlogin");
  } catch (err) {
    console.log(err)
  }
})

<<<<<<< HEAD
router.get('/verify', function (req, res) {
  res.render('users/normalUsers/verify')
})

router.post('/verify', async (req, res) => {
  try {
    const updateInfo = await User.updateOne(
      { _id: req.query.id },
      { $set: { normalisVerified: true } }
    )
    console.log(updateInfo)
  } catch (error) {
    console.log(error.message)
  }
})
=======
// router.use(
//   (verifyMail = async (req, res) => {
//     try {
//       const updateInfo = await User.updateOne(
//         { _id: req.query.id },
//         { $set: { normalisVerified: true } }
//       )
//       console.log("UpdateInfo :", updateInfo)
//       res.render("users/normalUsers/verify")
//     } catch (error) {
//       console.log(error.message)
//     }
//   })
// )

// router.get("/verify", verifyMail, function (req, res) {
//   res.render("users/normalUsers/verify")
// })

// router.post("/verify", function(req, res){
//   User.findOne({ normalEmail: req.body.normalEmail }, function (err, rtn) {
//     if (err) throw err
//     if (
//       rtn.normalisVerified === true &&
//       rtn != null &&
//       User.compare(req.body.normalPassword, rtn.normalPassword)
//       // User.compare(req.body.normalisVerified, rtn.normalisVerified)
//     ) {
//       //renember login
//       req.session.user = {
//         id: rtn._id,
//         normalName: rtn.normalName,
//         normalEmail: rtn.normalEmail,
//       }
//       res.redirect("/dashboard")
//     }
//      else {
//       res.render("users/normalUsers/nuserLogin", {
//         message: "တစ်စုံတစ်ရာ မှားယွင်းနေပါသည်။ အကောင့်ပြန်ဝင်ပါ ။",
//       })
//     }
//   })
// })
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f

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
<<<<<<< HEAD
router.get('/nlogin', function (req, res) {
  res.render('users/normalUsers/nuserLogin')
})

// normal users login data
router.post('/nlogin', function (req, res) {
  const data = User.findOne(
    { normalEmail: req.body.normalEmail },
    function (err, rtn) {
      if (err) throw err
      console.log(req.body.normalPassword)
      if (
        rtn != null &&
        User.compare(req.body.normalPassword, rtn.normalPassword)
      ) {
        //renember login
        req.session.user = {
          id: rtn._id,
          normalName: rtn.normalName,
          normalEmail: rtn.normalEmail,
        }
        res.redirect('/dashboard')
      } else {
        res.render('users/normalUsers/nuserLogin', {
          message: 'တစ်စုံတစ်ရာ မှားယွင်းနေပါသည် ။ အကောင့်ပြန်ဝင်ပါ ။',
        })
=======
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
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
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
<<<<<<< HEAD
  )
})

// normal user profile
router.get('/nprofile', userAuth, function (req, res) {
  res.render('users/normalUsers/nuser-profile.ejs')
})

// normal user reset password
router.get('/forget-password', function (req, res) {
  res.render('users/normalUsers/resetPassword')
})

// normal user forget password
router.get('/nforgetpassword', function (req, res) {
  res.render('users/normalUsers/nUserforgotPassword')
=======
  })
})

// normal user profile
router.get("/nprofile", userAuth, function (req, res) {
  res.render("users/normalUsers/nuser-profile.ejs")
})

// normal user reset password
router.get("/forget-password", function (req, res) {
  res.render("users/normalUsers/resetPassword")
})

// normal user forget password
router.get("/nforgetpassword", function (req, res) {
  res.render("users/normalUsers/nUserforgotPassword")
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
})

// router.get("/nforgetpassword", forgetLoad);

// todo normal user forget password data

router.post('/nforgetpassword', async (req, res) => {
  try {
    const normalEmail = req.body.normalEmail
<<<<<<< HEAD
    console.log('User Input Data :', normalEmail)
    User.findOne({ normalEmail: normalEmail }, (err, rtn) => {
      if (err) throw err
      console.log('UserDate :', rtn)
      if (rtn != null) {
        if (rtn.normalisVerified === false) {
          res.render('users/normalUsers/resetPassword', {
            message: 'သင့် အီးမေးလ် အတည်ပြုပါ ။',
=======
    console.log("User Input Data :", normalEmail)
    User.findOne({ normalEmail: normalEmail }, (err, rtn) => {
      if (err) throw err
      console.log("UserDate :", rtn)
      if (rtn != null) {
        if (rtn.normalisVerified === false) {
          res.render("users/normalUsers/resetPassword", {
            message: "သင့် အီးမေးလ် အတည်ပြုပါ။",
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
          })
        } else {
          const randomString = randomString.generate()
          const updatedDate = User.updateOne(
            { normalEmail: normalEmail },
            { $set: { token: randomString } }
          )
          // /nUserforgotPassword
          sendResetPasswordMail(rtn.normalName, rtn.normalEmail, randomString)
<<<<<<< HEAD
          res.render('users/normalUsers/resetPassword', {
            message: 'သင့် အီးမေးလ် ကို ကျေးဇူးပြု၍စစ်ပေးပါ ။',
          })
        }
      } else {
        res.render('users/normalUsers/resetPassword', {
          message: ' သင့် အီးမေးလ် မှားနေပါသည် ။',
=======
          res.render("users/normalUsers/resetPassword", {
            message: "သင့် အီးမေးလ် ကို ကျေးဇူးပြု၍စစ်ပေးပါ။",
          })
        }
      } else {
        res.render("users/normalUsers/resetPassword", {
          message: " သင့် အီးမေးလ် မှားနေပါသည်။",
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
        })
      }
    })
  } catch (error) {
    console.log(error.message)
  }
})

// agent sign up
<<<<<<< HEAD
router.get('/agentSignup', function (req, res) {
  res.render('users/agentUsers/agentSignup')
=======
router.get("/agentSignup", function (req, res) {
  res.render("users/agentUsers/agentSignup")
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
})

// agent sign up data
router.post('/agentSignup', function (req, res) {
  try {
    const { agentName, agentEmail, agentPassword } = req.body
    var user = new Agent({
      agentName,
      agentEmail,
      agentPassword,
      agentemailToken: crypto.randomBytes(64).toString('hex'),
      agentisVerified: false,
    })
    const newUser = user.save()
<<<<<<< HEAD
    console.log('NewUser:', newUser)

    res.redirect('/users/agentLogin')
=======
    console.log("NewUser:", newUser)

    res.redirect("/users/agentLogin")
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
  } catch (err) {
    console.log(err)
  }
})

// agent Login
<<<<<<< HEAD
router.get('/agentLogin', function (req, res) {
  res.render('users/agentUsers/agentLogin')
=======
router.get("/agentLogin", function (req, res) {
  res.render("users/agentUsers/agentLogin")
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
})

// agent login data
router.post('/agentLogin', function (req, res) {
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
<<<<<<< HEAD
      res.redirect('/users/agentpage')
    } else {
      res.render('users/agentUsers/agentLogin', {
        message: 'တစ်စုံတစ်ရာ မှားယွင်းနေပါသည် ။ အကောင့်ပြန်ဝင်ပါ ။',
=======
      res.redirect("/users/agentpage")
    } else {
      res.render("users/agentUsers/agentLogin", {
        message: "တစ်စုံတစ်ရာ မှားယွင်းနေပါသည်။ အကောင့်ပြန်ဝင်ပါ ။",
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
      })
    }
  })
})

// agent index
<<<<<<< HEAD
router.get('/agentpage', agentAuth, function (req, res) {
  res.render('users/agentUsers/agentindex')
})

// agent-post-detail
router.get('/adetail', agentAuth, function (req, res) {
  res.render('users/agentUsers/agent-post-details')
})

// agent-profile-detail
router.get('/aprofile', agentAuth, function (req, res) {
  res.render('users/agentUsers/agent-profile-detail')
})

//agent-post-list
// router.get('/apostlist', agentAuth, function (req, res) {
//   res.render('users/agentUsers/agent-post-list')
// })

//agent post add page
router.get('/apostadd', agentAuth, function (req, res) {
  res.render('users/agentUsers/agent-post-add')
})

// agent forget password
router.get('/aforgetpassword', function (req, res) {
  res.render('users/agentUsers/forget-password')
=======
router.get("/agentpage", agentAuth, function (req, res) {
  res.render("users/agentUsers/agentindex")
})

// agent-post-detail
router.get("/adetail", agentAuth, function (req, res) {
  res.render("users/agentUsers/agent-post-details")
})

// agent-profile-detail
router.get("/aprofile", agentAuth, function (req, res) {
  res.render("users/agentUsers/agent-profile-detail")
})

//agent-post-list
router.get("/apostlist", agentAuth, function (req, res) {
  res.render("users/agentUsers/agent-post-list")
})

//agent post add page
router.get("/apostadd", agentAuth, function (req, res) {
  res.render("users/agentUsers/agent-post-add")
})

// agent forget password
router.get("/aforgetpassword", function (req, res) {
  res.render("users/agentUsers/forget-password")
})

// agent change password
router.get("/agent-change-password", function (req, res) {
  res.render("users/agentUsers/changePassword")
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
})

//logout

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err
<<<<<<< HEAD
    res.redirect('/')
=======
    res.redirect("/")
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
  })
})

// postadd get method
router.get('/apostadd'),
  agentAuth,
  function (req, res) {
<<<<<<< HEAD
    res.render('/users/agentUsers/agent-post-add')
  }
=======
    res.render("/users/agentUsers/agent-post-add")
  }

// router.post("/apostadd"),
//   agentAuth,
//   upload.single("image"),
//   function (req, res) {
//     var post = new Post();
//     post.title = req.body.title;
//     post.place = req.body.place;
//     post.image = req.body.image;
//     post.author = req.session.user.id;
//     post.content = req.body.content;
//     post.created = Date.now();
//     if (req.file) post.image = "/images/testinomials/" + req.file.filename;
//     post.save(function (err, rtn) {
//       if (err) throw err;
//       console.log(rtn);
//       res.redirect("/apostlist");
//     });
//   };
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f

router.post(
  '/apostadd',
  agentAuth,
  upload.single('image'),
  function (req, res) {
    console.log(req.body)
    var post = new Post()
    post.title = req.body.title
    post.place = req.body.place
    post.author = req.session.agent.id
    post.content = req.body.content
    post.created = Date.now()
<<<<<<< HEAD
    if (req.file) post.image = '/images/testimonials/' + req.file.filename
    post.save(function (err, rtn) {
      if (err) throw err
      console.log(rtn)
      res.redirect('/users/apostlist')
=======
    if (req.file) post.image = "/images/testimonials/" + req.file.filename
    post.save(function (err, rtn) {
      if (err) throw err
      console.log(rtn)
      res.redirect("/users/apostlist")
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
    })
  }
)

// for post list
router.get('/apostlist', agentAuth, function (req, res) {
  Post.find({ author: req.session.agent.id }, function (err, rtn) {
    if (err) throw err
<<<<<<< HEAD
    res.render('users/agentUsers/agent-post-list', { posts: rtn })
=======
    console.log(rtn)
    res.render("/users/agentUsers/agent-post-list", { posts: rtn })
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
  })
})

// check users name duplicate
router.post('/checkname', function (req, res) {
  User.findOne({ normalName: req.body.normalName }, function (err, rtn) {
    if (err) {
      res.json({
<<<<<<< HEAD
        message: 'Internal server error',
        status: 'error',
      })
    } else {
      res.json({
        status: rtn != null ? 'username have' : 'username no have',
=======
        message: "Internal server error",
        status: "error",
      })
    } else {
      res.json({
        status: rtn != null ? "username have" : "username no have",
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
      })
    }
  })
})

// check users emalil duplicate

router.post('/checknemail', function (req, res) {
  User.findOne({ normalEmail: req.body.normalEmail }, function (err, rtn) {
    if (err) {
      res.json({
<<<<<<< HEAD
        message: 'Internal server error',
        status: 'error',
      })
    } else {
      res.json({
        status: rtn != null ? 'have' : 'no have',
=======
        message: "Internal server error",
        status: "error",
      })
    } else {
      res.json({
        status: rtn != null ? "have" : "no have",
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
      })
    }
  })
})

// check agent email duplicate
router.post('/checkagentemail', function (req, res) {
  Agent.findOne({ agentEmail: req.body.agentEmail }, function (err, rtn) {
    if (err) {
      res.json({
<<<<<<< HEAD
        message: 'Internal server error',
        status: 'error',
      })
    } else {
      res.json({
        status: rtn != null ? 'have' : 'no have',
=======
        message: "Internal server error",
        status: "error",
      })
    } else {
      res.json({
        status: rtn != null ? "have" : "no have",
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
      })
    }
  })
})

// check agent name duplicate
router.post('/checkagentname', function (req, res) {
  Agent.findOne({ agentName: req.body.agentName }, function (err, rtn) {
    if (err) {
      res.json({
<<<<<<< HEAD
        message: 'Internal server error',
        status: 'error',
      })
    } else {
      res.json({
        status: rtn != null ? 'already name' : 'no have name',
=======
        message: "Internal server error",
        status: "error",
      })
    } else {
      res.json({
        status: rtn != null ? "already name" : "no have name",
>>>>>>> 4bbb98ce74a59b86369d9b4a533a13eee5df8f7f
      })
    }
  })
})

module.exports = router
