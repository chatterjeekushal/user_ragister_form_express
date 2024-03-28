const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();

const path = require("path");

const {ragisteruser} = require("../controller/user.controller.js");

const {new_profile_image}=require("../controller/user.controller.js");

const upload=require("../middleware/multer.js")

const varifyjwt = require("../middleware/auth.js");




// router.post('/login', upload =>{
 // Assuming 'login' is the method in ragisteruser


 router.route("/login").post(upload.fields([{ name: "profileimage", maxCount: 1 }, { name: "coverimage", maxCount: 1 }]),ragisteruser)

 
 router.route("/new").post(varifyjwt,upload.single("rana"),new_profile_image)


module.exports = router;
