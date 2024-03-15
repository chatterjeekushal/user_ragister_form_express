

const express = require("express")

const bodyperser = require('body-parser');
const router = express.Router() // import router mathod

const mongoose = require('mongoose');

const User = require('../user_database');
const bcrypt = require("bcryptjs"); // import bcrypt js 

const {loginuser}=require("../controller/user.controller")








// //login route

// router.post('/userlogin', async (req, res) => {

//     let logemail=req.body.loginemail

//     let logpass=req.body.loginpass


// let userexist= await User.findOne({email:logemail})

// console.log(userexist.password);

// const passcompare = await bcrypt.compare(logpass,userexist.password)

// if(userexist){

//     console.log("email true");

//     if(passcompare){

//         console.log("pasword  mach");
//     }
//     else{
//         console.log("password not mach");
//     }

// }
// else{
//     console.log("email false");
// }

// })




router.route("/userlogin").post(loginuser)











module.exports = router // exports routs