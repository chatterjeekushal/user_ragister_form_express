

const express = require("express")

const bodyperser=require('body-parser');
const router = express.Router() // import router mathod

const mongoose=require('mongoose');

const User=require('../user_database')



router.get('/myloginpage',(req,res)=>{

    res.send("hello login");

})

router.post('/login', async (req,res)=>{

   
    const user= new User({username:req.body.username,email:req.body.useremail,password:req.body.password})
    
    await user.save()
    
  res.send(`welcome user ${user}`)
    
    })

module.exports=router // exports routs