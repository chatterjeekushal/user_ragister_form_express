

const express = require("express")

const bodyperser = require('body-parser');
const router = express.Router() // import router mathod

const mongoose = require('mongoose');

const path = require("path")

const User = require('../user_database')

const multer = require("multer"); // import multer


const uplord = multer({

  storage: multer.diskStorage({

    destination: function (req, file, cb) {

      cb(null, "uploads")
    },

    filename: function (req, file, cb) {

      // let filetype = file.originalname.split(".")[1]

      let file_type = path.extname(file.originalname)

      console.log(file_type);

      cb(null, file.fieldname + "-" + Date.now() + file_type)
    }

  })

}).single("profileimage")


console.log(uplord);




router.post('/login', uplord, async (req, res) => {

  try {


    // if profile pic not uplored your data not save

    if (!res.file) {

      return res.status(404).send("profile pic uplord")
    }


    let file_data = req.file.originalname; // file original path
    console.log(file_data);





    const user = new User({ username: req.body.username, email: req.body.useremail, password: req.body.password, profileimage: file_data })


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

