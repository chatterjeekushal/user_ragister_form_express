

const express = require("express")

const body_parser = require("body-parser")


const bcrypt = require("bcryptjs"); // import bcrypt js 

const User = require('../user_database.js')



const uploredcloudnary = require("../utils/cloudnary.js")








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











const loginuser= async(req,res)=>{

    try {


        let { email, password } = req.body


        let userexist = await User.findOne({ email })





        if (userexist) {

            console.log("user exsits");

            const passcompare = await bcrypt.compare(password, userexist.password)

            if (passcompare) {

                console.log("password mach");

                console.log(userexist.email,userexist.password);

                res.status(200).json({ msg: userexist, token: await userexist.generateToken() , id:userexist.id});


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



module.exports={ragisteruser , loginuser}