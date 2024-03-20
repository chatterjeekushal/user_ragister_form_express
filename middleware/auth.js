


const cookie = require('cookie-parser') // import cookie parser

const jwt = require("jsonwebtoken"); // import jwt web token

const User = require("../user_database.js");
const { model } = require('mongoose');

const varifyjwt = async (req, res, next) => {

    try {
        const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer", "")


        if (!token) {

            throw new Error("unauthoristes request")
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

        console.log(decodedToken);

        const decodeduser = await User.findById(decodedToken?._id)

        if (!decodeduser) {

            throw Error("invalid access token")
        }

        req.decodeduser = decodeduser;

        next()

    } catch (error) {


        throw new Error("invalid access token user")

    }

}

module.exports=varifyjwt;