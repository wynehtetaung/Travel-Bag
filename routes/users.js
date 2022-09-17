var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//normal users sign up
router.get("/nsignup", function (req, res) {
  res.render("users/normalUsers/nuserLogin");
});

// normal users login
router.get("/nlogin", function (req, res) {
  res.render("users/normalUsers/nuserlogin");
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
