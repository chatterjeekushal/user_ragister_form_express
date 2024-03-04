

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs"); // import bcrypt js 

const jwt = require("jsonwebtoken"); // import jwt web token

require('dotenv').config({ path: './env' });






const UserSchema = new mongoose.Schema({


    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileimage: {
        type: String
    },



}, { timestamps: true })




UserSchema.pre('save', async function (next) {


    console.log(`pre mathod ${this}`) // out put :  pre mathod {
    //     username: 'kushal',
    //     email: 'kushal@gmail.com',
    //     password: 'kushal3005',
    //     _id: new ObjectId('65cb923252a03e8243e0567c'),
    //     createdAt: 2024-02-13T16:00:50.051Z,
    //     updatedAt: 2024-02-13T16:00:50.051Z
    //   }



    const myuser = this;

    if (!myuser.isModified('password')) {

        next()
    }

    // convart normal password to hash password

    try {

        myuser.password = await bcrypt.hash(myuser.password, 10)

        next()

    } catch (error) {

        console.log(`password bcrypt poblem ${error}`);

        next(error);

    }

});














// json web tokan start

UserSchema.methods.generateToken = async function () {

    try {

        return jwt.sign({

            _id: this._id,
            email: this.email,
            username: this.username,

        }, process.env.JWT_SECRET_KEY, { expiresIn: "2d" });

    } catch (error) {

        console.error(`jwt token error ${error}`);
    }


};








module.exports = mongoose.model('User', UserSchema)

