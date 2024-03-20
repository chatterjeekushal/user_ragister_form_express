

const express = require("express")

const body_parser = require("body-parser")


const bcrypt = require("bcryptjs"); // import bcrypt js 

const User = require('../user_database.js')



const uploredcloudnary = require("../utils/cloudnary.js")



const cookie = require('cookie-parser')



const GanarateToken = async (userid) => {

    try {


        const userexist = await User.findById(userid)

        const accessToken = await userexist.generateToken()

        const refreshToken = await userexist.refrashToken()



        userexist.RefToken = refreshToken

        await userexist.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {

        console.log(`token ganarate error ${error}`);
    }

}






const ragisteruser = async (req, res) => {


    try {


        let profileimage = req.files?.profileimage[0]?.path; // file original path
        console.log(profileimage);


        let coverimage = req.files?.coverimage[0]?.path;

        console.log(coverimage);

        const profile = await uploredcloudnary(profileimage)

        const cover = await uploredcloudnary(coverimage)

        console.log(profile.url);

        console.log(cover.url);

        const user = new User({ username: req.body.username, email: req.body.useremail, password: req.body.password, profileimage: profile.url })


        const olradyragister = await User.findOne({ email: req.body.useremail })

        if (olradyragister) {

            console.log("user exsist this email");
        }




        else {

            const data = await user.save()

            res.status(200).json({ msg: data, token: await data.generateToken(), id: data._id });

        }





    } catch (error) {

        res.status(500).json("internal server error")

    }


}











const loginuser = async (req, res) => {

    try {


        let { email, password } = req.body


        let userexist = await User.findOne({ email })





        if (userexist) {

            console.log("user exsits");

            const passcompare = await bcrypt.compare(password, userexist.password)

            if (passcompare) {

                console.log("password mach");

                console.log(userexist.email, userexist.password);

                // // ganarate refrash token

                // const reftoken= await userexist.refrashToken()

                // console.log(`reftoken is ${reftoken}`);

                // // update refresh token userschema refrsh token feild

                // userexist.RefToken=reftoken

                // // save refrash token in database

                // await userexist.save({validateBeforeSave:false})



                const { accessToken, refreshToken } = await GanarateToken(userexist._id)



                //send cookies 

                const options = {

                    httpOnly: true,
                    secure: true,
                }


                return res
                    .status(200).cookie("accessToken", accessToken, options)
                    .cookie("refreshToken", refreshToken, options)
                    .json({ msg: userexist, accessToken: accessToken, id: userexist.id, refreshToken: refreshToken })


                // res.status(200).json({ msg: userexist, accessToken: accessToken, id: userexist.id, refreshToken: refreshToken });


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

}







// logout user



const logoutuser = async (req, res) => {





}
































module.exports = { ragisteruser, loginuser,logoutuser }