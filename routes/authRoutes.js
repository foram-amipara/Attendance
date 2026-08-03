const express = require("express");
const router =express.Router();
const authController =require("../controllers/authController");
const {validateSignup,validateLogin}=require("../middleware/validate");




router.route("/signup")
    .post(validateSignup,authController.signUp);

router.route("/login")
    .post(validateLogin,authController.logIn);

module.exports=router;