

const express = require("express")

const router = express.Router() // import router mathod

const {loginuser}=require("../controller/user.controller.js")

const {refrashAccessToken}=require("../controller/user.controller.js")






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


router.route("/newuserlogin").post(refrashAccessToken)



// sequred route










module.exports = router // exports routs