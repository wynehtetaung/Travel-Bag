var express = require("express");
var router = express.Router();
var Admin = require("../models/Admin");
var crypto = require("crypto");
var Post = require("../models/agent-postadd");
var Agent = require("../models/aUsers");
var User = require("../models/nUsers");

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

// user active and ban

router.post("/admin/changeStatus", adminAuth, function (req, res) {
  var update;
  if (req.body.status == "active") {
    update = { normalisact_ban: true };
  } else {
    update = { normalisact_ban: false };
  }
  // console.log(req.body, update);
  User.findByIdAndUpdate(req.body.id, { $set: update }, function (err, rtn) {
    if (err) {
      res.json({ status: "error" });
    } else {
      res.json({ status: true });
    }
  });
});

// agent active and ban

router.post("/admin/agentchangeStatus", adminAuth, function (req, res) {
  var updated;
  if (req.body.status == "active") {
    updated = { normalisact_ban: true };
  } else {
    updated = { normalisact_ban: false };
  }
  // console.log(req.body, update);
  Agent.findByIdAndUpdate(req.body.id, { $set: updated }, function (err, rtn) {
    if (err) {
      res.json({ status: "error" });
    } else {
      res.json({ status: true });
    }
  });
});

//admin agent post list
router.get("/adminpage/adminpostlist", adminAuth, function (req, res) {
  Post.find({}, function (err, rtn) {
    if (err) throw err;
    console.log(err);
    res.render("admin/admin-agent-post-list", { posts: rtn });
  });
});

// agent post detail
router.get("/adminAdetail/:id", adminAuth, function (req, res) {
  Post.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.render("admin/admin-agent-post-detail", { posts: rtn });
  });
});

//admin agent list
router.get("/adminpage/agentlist", adminAuth, function (req, res) {
  Agent.find({}, function (err, rtn) {
    if (err) throw err;
    res.render("admin/admin-agent-list", { ausers: rtn });
  });
});

// agent profile see to from admin
router.get("/adminAprofile/:id", adminAuth, function (req, res) {
  Agent.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.render("admin/admin-agent-profile", { ausers: rtn });
  });
});

// normal list
router.get("/adminpage/normallist", adminAuth, function (req, res) {
  User.find({}, function (err, rtn) {
    // console.log("rrrrrr", req.params._id);
    // console.log("gggg", rtn);
    // const rtnData = rtn._id;
    // const reqData = req.
    // console.log("show me", rtn);
    const rtnDtat = rtn.normalEmail;
    const datayyy = "635cc49a492527c2c8e8c34d";
    const userdata = User.findOne({ _id: datayyy }, function (err, rtn) {
      if (err) throw err;
      // console.log("hhhhh", rtn);
    });
    // console.log("user data: ", rtn.normalName);
    // console.log("show", User.findOne({}));
    if (err) throw err;
    res.render("admin/admin-normal-list", { user: rtn });
  });
});

// router.post("/adminpage/normallist", function (req, res) {
//   console.log("gggg", req.params.normalEmail);
// });

//normaal user detail
router.get("/adminpage/adminNprofile/:id", adminAuth, function (req, res) {
  User.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.render("admin/admin-normal-users-profile", { user: rtn });
  });
});

// normal user delete
router.get("/normaluserdelete/:id", function (req, res) {
  User.findByIdAndDelete(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.redirect("/adminpage/normallist");
  });
});

// agent user delete
router.get("/agentuserdelete/:id", function (req, res) {
  Agent.findByIdAndDelete(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.redirect("/adminpage/agentlist");
  });
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
  Post.findById(req.params.id)
    .populate("author", "agentName agentPhone")
    .exec(function (err, rtn) {
      if (err) throw err;
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

// searchbar
router.get("/search", function (req, res) {
  res.render("searchBox");
});

// 404 not found
router.get("/page_not_found", function (req, res) {
  res.render("fof");
});

module.exports = router;
