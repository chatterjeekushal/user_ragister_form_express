

const express = require('express')

const bodyperser=require('body-parser');

const mongoose=require('mongoose');

const User=require('./user_database')


async function database(){


await mongoose.connect('mongodb://127.0.0.1:27017/user');

}

database()

const app = express()
const port = 3000



app.use(bodyperser.urlencoded({extended:true}))


app.get('/', (req, res) => {
  
    res.sendFile("/static/index.html",{root:__dirname});
})

app.post('/login', async (req,res)=>{

const user= new User({username:req.body.username,email:req.body.useremail,password:req.body.password})

await user.save()

res.send(`hello user`);

})






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})