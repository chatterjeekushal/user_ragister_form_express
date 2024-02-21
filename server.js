

const express = require('express')

const bodyperser=require('body-parser');

const mongoose=require('mongoose');

const User=require('./user_database')

const user_ragister=require('./routers/user_ragister.routes.js') // import routers 

const user_login=require("./routers/user_login.routes.js") // import


async function database(){


await mongoose.connect('mongodb://127.0.0.1:27017/user');

}

database()

const app = express()
const port = process.env.PORT || 3000



app.use(bodyperser.urlencoded({extended:true}))



app.use('/users',user_ragister) // import routers meddileware syntax: app.use("/target route","import router name")

app.use('/login',user_login)








app.get('/', (req, res) => {
  
    res.sendFile("/static/index.html",{root:__dirname});
})


app.get('/login', (req, res) => {
  
  res.sendFile("/static/login.html",{root:__dirname});
})









app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})