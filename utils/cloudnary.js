
// Require the Cloudinary library


const fs = require("fs")

const cloudinary=require("cloudinary").v2;

require('dotenv').config({ path: './env' });

cloudinary.config({
    cloud_name:process.env.CLOUDNAME,
    api_key:process.env.APIKEY,
    api_secret:process.env.APISECRET,
});


const uploredcloudnary=async(localpath) => {


    try {


        

        // uplord file on clouddinary

        const responce = await cloudinary.uploader.upload(localpath,{resource_type:"auto"},(error,result)=>{

            console.log(`my lesult is ${result} ${error}`);
        })

        return responce;

        


    } catch (error) {

        console.log(`cloudynary uplord error ${error}`);

    }


}

module.exports=uploredcloudnary;