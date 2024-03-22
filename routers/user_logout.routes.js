const express = require("express");
const router = express.Router();
const verifyjwt = require("../middleware/auth.js");
const { logoutuser } = require("../controller/user.controller.js");



// Secured route for logout using POST method
router.get("/logoutuser", verifyjwt, logoutuser);




module.exports = router;
