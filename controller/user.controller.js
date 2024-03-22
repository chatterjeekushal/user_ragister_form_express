

const express = require("express")

const body_parser = require("body-parser")


const bcrypt = require("bcryptjs"); // import bcrypt js 

const User = require('../user_database.js')



const uploredcloudnary = require("../utils/cloudnary.js")


const jwt = require("jsonwebtoken");



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
    try {
        // Update the user document to remove the refresh token
        await User.findByIdAndUpdate(req.decodeduser._id, { $set: { refreshToken: undefined } }, { new: true });

        // Set options for cookie clearing
        const options = {
            httpOnly: true,
            secure: true, // Consider setting this based on your deployment environment
        };

        // Clear both access and refresh tokens from cookies
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ msg: "User logged out" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};










const refrashAccessToken = async (req, res) => {



    try {
        const incomingRefrahToken = req.cookies.refrashToken || req.body.refrashToken


        if (!incomingRefrahToken) {

            throw new Error("invalid refrash token")
        }

        console.log(`my incoming ref token ${incomingRefrahToken}`);

        const decoded_ref_token = jwt.verify(incomingRefrahToken, process.env.REFRESH_TOKEN_SECRET)


        const decoded_ref_token_user = await User.findById(decoded_ref_token?._id)


        if (!decoded_ref_token_user) {

            throw new Error("invalid user ref token")
        }


        if (incomingRefrahToken !== decoded_ref_token_user) {

            throw new Error("ref token is expred or used")
        }

        const options = {

            httpOnly: true,
            secure: true,
        }

        const { new_grnarate_acces_token, new_grnarate_ref_token } = await GanarateToken(decoded_ref_token_user._id)

        return res
            .status(200)
            .cookie("new_grnarate_acces_token", new_grnarate_acces_token, options)
            .cookie("new_grnarate_ref_token", new_grnarate_ref_token, options)
            .json({ msg: "new acces token and new refrash token ganarate", new_grnarate_acces_token: new_grnarate_acces_token, new_grnarate_ref_token: new_grnarate_ref_token })


    } catch (error) {

        throw new Error("new refrash token ganarate poblem")

    }
}























module.exports = { ragisteruser, loginuser, logoutuser,refrashAccessToken }