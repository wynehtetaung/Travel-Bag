var express = require("express");
var router = express.Router();
var Admin = require("../models/Admin");
var crypto = require("crypto");
var Post = require("../models/agent-postadd");
var agent = require("../models/aUsers");

var userAuth = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/users/nlogin");
  }
};
var adminAuth = function (req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/adminLogin");
  }
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Admin Sign UP
router.get("/adminSignup", function (req, res) {
  res.render("admin/adminSignUp");
});

// admin sign up data
router.post("/adminSignup", function (req, res) {
  try {
    const { adminName, adminEmail, adminPassword } = req.body;
    var user = new Admin({
      adminName,
      adminEmail,
      adminPassword,
      adminemailToken: crypto.randomBytes(64).toString("hex"),
      adminisVerified: false,
    });
    // const salt = new bcrypt.genSalt(10);
    // const hashPassword = bcrypt.hash(user.normalPassword, salt);
    // user.normalPassword = hashPassword;
    const newUser = user.save();
    console.log("NewUser :", newUser);

    res.redirect("/adminLogin");
  } catch (err) {
    console.log(err);
  }
});

// Admin Login
router.get("/adminLogin", function (req, res) {
  res.render("admin/adminLogin");
});

// admin login data
router.post("/adminLogin", function (req, res) {
  Admin.findOne({ adminEmail: req.body.adminEmail }, function (err, rtn) {
    if (err) throw err;
    if (
      rtn != null &&
      Admin.compare(req.body.adminPassword, rtn.adminPassword)
    ) {
      //renember login
      req.session.admin = {
        id: rtn._id,
        adminName: rtn.adminName,
        adminEmail: rtn.adminEmail,
      };

      //create token
      // var token = createToken(findById);
      // var token = createToken(findeUser.id);
      // console.log(token);

      // store token in cookie
      // res.cookie("access-token", token);

      res.redirect("/adminpage");
    } else {
      res.redirect("/adminLogin");
    }
  });
});

// Admin Index Page
router.get("/adminpage", adminAuth, function (req, res) {
  res.render("admin/adminindex");
});

// admin post list
// router.get("/adminpage#portfolio", adminAuth, function (req, res) {
//   Post.find({ author: req.session.agent.id }, function (err, rtn) {
//     if (err) throw err;
//     res.render("admin#portfolio", { posts: rtn });
//   });
// });

//admin agent list
router.get("/adminpage#contact", adminAuth, function (req, res) {
  Agent.find({ author: req.session.agent.id }, function (err, rtn) {
    if (err) throw err;
    res.render("admin#contact", { ausers: rtn });
  });
});

// agent detail see to from admin
router.get("/adminAdetail", adminAuth, function (req, res) {
  res.render("admin/admin-agent-post-detail");
});

// agent profile see to from admin
router.get("/adminAprofile", adminAuth, function (req, res) {
  res.render("admin/admin-agent-profile");
});

// normal user profile see to from admin
router.get("/adminNprofile", adminAuth, function (req, res) {
  res.render("admin/admin-normal-users-profile");
});

// about us
router.get("/about", function (req, res) {
  res.render("about");
});

// DeshBoard
router.get("/dashboard", userAuth, function (req, res) {
  Post.find({})
    .populate("author", "agentName")
    .exec(function (err, rtn) {
      if (err) throw err;
      console.log(rtn);
      res.render("dashboard", { posts: rtn });
    });
});

router.get("/post-detail/:id", userAuth, function (req, res) {
  Post.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    console.log(err);
    res.render("users/normalUsers/post-detail", { blog: rtn });
  });
});

// signup choice account
router.get("/account", function (req, res) {
  res.render("choiceAcc");
});

// login choice account
router.get("/loginaccount", function (req, res) {
  res.render("choicelogin");
});

// google map
router.get("/map", userAuth, function (req, res) {
  res.render("map");
});

// 404 not found
router.get("/page_not_found", function (req, res) {
  res.render("fof");
});

module.exports = router;
