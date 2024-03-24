


const mongoose = require("mongoose");

const { schema } = require("./user_database"); // import schema from user schema



const subsciptionSchema = new mongoose.Schema({

    subscriber: {
        type: schema.Types.ObjectId, // one who is subcribing
        ref: "User"
    },

    channel: {

        type: schema.Types.ObjectId, // one to whom "subscriber" is suscribing
        ref: "User"
    }




}, { timestamps: true })




module.exports = mongoose.model('subsciption', subsciptionSchema)