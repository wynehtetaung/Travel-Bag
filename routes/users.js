var express = require("express");
var router = express.Router();
var User = require("../models/nUsers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//normal users sign up
router.get("/nsignup", function (req, res) {
  res.render("users/normalUsers/nuserSignUp");
});

//normal users sign up data
router.post("/nsignup", function (req, res) {
  var user = new User();
  user.names = req.body.namea;
  user.emails = req.body.emaila;
  user.passwords = req.body.passworda;
  user.save(function (err, rtn) {
    if (err) throw err;
    console.log(rtn);
    res.redirect("/users/nlogin");
  });
});

// normal users login
router.get("/nlogin", function (req, res) {
  res.render("users/normalUsers/nuserLogin");
});

// agent sign up
router.get("/agentSignup", function (req, res) {
  res.render("users/agentUsers/agentSignup");
});

// agent Login
router.get("/agentLogin", function (req, res) {
  res.render("users/agentUsers/agentLogin");
});

// agent index
router.get("/agentpage", function (req, res) {
  res.render("users/agentUsers/agentindex");
});

module.exports = router;
