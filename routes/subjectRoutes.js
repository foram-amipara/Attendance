const express = require("express");
const router =express.Router();
const subjectController =require("../controllers/subjectController");
const {validateSubject}=require("../middleware/validate");
const protect = require("../middleware/authMiddleware.js");


router.use(protect);

router.route("/")
    .get(subjectController.getSubject)
    .post(validateSubject,subjectController.createSubject);