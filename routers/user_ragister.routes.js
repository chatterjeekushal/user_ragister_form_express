const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {ragisteruser} = require("../controller/user.controller.js");


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      let fileExtension = path.extname(file.originalname);
      console.log(fileExtension);
      cb(null, file.fieldname + fileExtension);
    }
  })
}).fields([{ name: "profileimage", maxCount: 1 }, { name: "coverimage", maxCount: 1 }]);




// router.post('/login', upload =>{
 // Assuming 'login' is the method in ragisteruser


 router.route("/login").post(upload,ragisteruser)

module.exports = router;
