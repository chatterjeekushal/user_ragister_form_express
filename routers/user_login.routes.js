

const express = require("express")

const bodyperser = require('body-parser');
const router = express.Router() // import router mathod

const mongoose = require('mongoose');

const User = require('../user_database');
const bcrypt = require("bcryptjs"); // import bcrypt js 
const e = require("express");







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




router.post("/userlogin", async (req, res) => {


    try {


        let { email, password } = req.body


        let userexist = await User.findOne({ email })





        if (userexist) {

            console.log("user exsits");

            const passcompare = await bcrypt.compare(password, userexist.password)

            if (passcompare) {

                console.log("password mach");

                res.send("welcome user")
            }
            else {

                console.log("password not mach");
            }

        }
        else {

            console.log("user not exsite");
        }



    } catch (error) {


        res.send(error)


    }



})











module.exports = router // exports routs