

const express = require('express')

const bodyperser = require('body-parser');



const mongoose = require('mongoose');

const User = require('./user_database')

const user_ragister = require('./routers/user_ragister.routes.js') // import routers 

const user_login = require("./routers/user_login.routes.js") // import

const user_logout=require("./routers/user_logout.routes.js")

const cookie = require('cookie-parser') // import cookie parser


async function database() {


  await mongoose.connect('mongodb://127.0.0.1:27017/user');

}

database()

const app = express()
const port = process.env.PORT || 3000



app.use(bodyperser.urlencoded({ extended: true })) // if you use body parser you should use this code

app.use(cookie()) // use cookie parser 




app.use('/users', user_ragister) // import routers meddileware syntax: app.use("/target route","import router name")

app.use('/login', user_login)

app.use('/userlogout',user_logout)








app.get('/', (req, res) => {

  res.sendFile("/static/index.html", { root: __dirname }); // syntax: res.sendfile("full file path,root_diractry")
})


app.get('/login', (req, res) => {

  res.sendFile("/static/login.html", { root: __dirname });
})


app.get("/logout",(req,res)=>{

  res.sendFile("/static/logout.html",{root:__dirname})

})









app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})