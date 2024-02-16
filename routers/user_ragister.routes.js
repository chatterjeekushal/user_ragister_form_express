

const express = require("express")

const bodyperser = require('body-parser');
const router = express.Router() // import router mathod

const mongoose = require('mongoose');

const User = require('../user_database')



router.post('/myloginpage', (req, res) => {

  res.status(200).json({md:"my post request"});

})












router.post('/login', async (req, res) => {

  try {

    const user = new User({ username: req.body.username, email: req.body.useremail, password: req.body.password })



   const data = await user.save()



    res.status(200).json({ msg: data, token: await data.generateToken()});




  } catch (error) {

    res.status(500).json("internal server error")

  }


});

module.exports = router // exports routs