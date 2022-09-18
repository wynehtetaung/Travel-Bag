var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Admin Sign UP
router.get("/adminSignup", function (req, res) {
  res.render("admin/adminSignUp");
});

// Admin Login
router.get("/adminLogin", function (req, res) {
  res.render("admin/adminLogin");
});

// Admin Index Page
router.get("/adminpage", function (req, res) {
  res.render("admin/adminindex");
});

// about us
router.get("/about", function (req, res) {
  res.render("about");
});

// 404 not found
router.get("/page_not_found", function (req, res) {
  res.render("fof");
});

module.exports = router;
