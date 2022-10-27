const multer = require("multer");
const path = require("path");

const UserEmail = "travelbagproject30@gmail.com";
const UserPassword = "";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../public/images/upload"));
  },
  filename: function (req, file, callback) {
    const name = Date.now() + "-" + file.originalname;
    callback(null, name);
  },
});

const upload = multer({ storage: storage });

module.exports = {
  UserEmail,
  UserPassword,
  upload,
};
