

const express = require("express")

const body = require("body-parser")


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

            res
                .status(200)
                .json({ msg: data, token: await data.generateToken(), id: data._id })



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








const changeCurrentPassword = async (req, res) => {


    const { oldPassword, newPassword } = req.body

    const login_user = await User.findById(req.decodeduser?._id)


    const login_user_password = await bcrypt.compare(oldPassword, login_user.password)

    if (!login_user_password) {

        throw Error("invalid old password")
    }

    User.password = newPassword;

    await User.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json({ msg: "your new password save" })

}




const getcurrent_user = async (req, res) => {

    console.log(`cookie is ${req.decodeduser}`);

    return res
        .status(200)
        .json({ current_user: req.decodeduser, msg: "current user fetched successfully" })

}


const new_profile_image = async (req, res) => {
    try {
        const new_profile_image = req.file?.path; // Accessing the path of the uploaded file

        if (!new_profile_image) {
            throw new Error("Uploaded file path is undefined");
        }




        const change_profile_image = await uploredcloudnary(new_profile_image)

        if (!change_profile_image.url) {

            throw new Error("image url not found")
        }

        console.log(change_profile_image);

        await User.findByIdAndUpdate(req.decodeduser?._id, { $set: { profileimage: change_profile_image.url } }, { new: true })

        return res
            .status(200)
            .json({ msg: "profile image update", })


    } catch (error) {
        console.error("Error processing file upload:");
        res.status(400).json({ msg: "new profile image update poblem" });
    }
}










const getuserchanelprofile = async (req, res) => {

    const { username } = req.params

    if (!username?.trim()) {

        throw new Error("username is messing")
    }


    const chanel = await User.aggregate([

        {
            $match: {
                username: username?.toLowerCase()
            }
        },

        {
            $lookup: {

                from: "subsciptions",
                localField: "_id",

                foreignField: "channel",
                as: "subscribers"
            }
        },


        {

            $lookup: {

                from: "subsciptions",
                localField: "_id",

                foreignField: "subscriber",
                as: "subscribedTo"

            }
        },

        {

            $addFields:{

                subscribersCount:{
                    $size:"$subscribers"
                },

                channelsubscribedTocount:{
                    $size:"$subscribedTo"
                },
                issubscribed:{

                    $cond:{
                        if:{$in:[req.decodeduser?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },

        {
            $project:{

                username:1,
                subscribersCount:1,
                channelsubscribedTocount:1,
                profileimage:1

            }
        }



    ])

    console.log(chanel);

    if(!chanel?.length){

        throw new Error("channel dose not exjist")
    }

    return res
    .status(200)
    .json({msg:"user chanel fashed susseysfully", data:chanel[0]})

}



























module.exports = { ragisteruser, loginuser, logoutuser, refrashAccessToken, changeCurrentPassword, getcurrent_user, new_profile_image, getuserchanelprofile }

