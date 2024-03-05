

const express = require("express")

const bodyperser = require('body-parser');
const router = express.Router() // import router mathod

const mongoose = require('mongoose');

const path = require("path")

const User = require('../user_database')

const multer = require("multer"); // import multer

const uploredcloudnary=require("../utils/cloudnary.js")







const uplord = multer({

  storage: multer.diskStorage({

    destination: function (req, file, cb) {

      cb(null, "uploads")
    },

    filename: function (req, file, cb) {

      // let filetype = file.originalname.split(".")[1]

      let file_type = path.extname(file.originalname)

      console.log(file_type);

      cb(null, file.fieldname + file_type)
    }

  })

}).fields([{name:"profileimage",maxCount:1},{name:"coverimage",maxCount:1}])







router.post('/login', uplord, async (req, res) => {

  try {


    





    let profileimage =req.files?.profileimage[0]?.path; // file original path
    console.log(profileimage);


    let coverimage=req.files?.coverimage[0]?.path;
    
console.log(coverimage);

const profile=await uploredcloudnary(profileimage)

const cover=await uploredcloudnary(coverimage)

console.log(profile.url);

console.log(cover.url);

    const user = new User({ username: req.body.username, email: req.body.useremail, password: req.body.password, profileimage: profile.url })


    const olradyragister = await User.findOne({ email: req.body.useremail })

    if (olradyragister) {

      console.log("user exsist this email");
    }




    else {

      const data = await user.save()

      res.status(200).json({ msg: data, token: await data.generateToken() });

    }





  } catch (error) {

    res.status(500).json("internal server error")

  }


});

module.exports = router // exports routs

