const express = require("express");
const router =express.Router();
const authController =require("../controllers/authController");
const {validateSignup,validateLogin}=require("../middleware/validate");
const wrapAsync=require("../utils/wrapAsync");



router.route("/signup")
    .post(validateSignup,wrapAsync(authController.signUp));

router.route("/login")
    .post(validateLogin,wrapAsync(authController.logIn));

module.exports=router;