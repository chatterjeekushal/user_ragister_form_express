

const express = require("express")

const bodyperser = require('body-parser');
const router = express.Router() // import router mathod

const mongoose = require('mongoose');

const User = require('../user_database')

const multer = require("multer"); // import multer


const uplord = multer({

  storage: multer.diskStorage({

    destination: function (req, file, cb) {

      cb(null, "uploads")
    },

    filename: function (req, file, cb) {

      console.log(file.originalname.split("."));

      cb(null, file.fieldname + "-" + Date.now() + ".jpg")
    }

  })

}).single("user_name")








router.post('/login', async (req, res) => {

  try {

    const user = new User({ username: req.body.username, email: req.body.useremail, password: req.body.password })


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

