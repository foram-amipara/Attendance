const express = require("express");
const router =express.Router();
const attendanceController =require("../controllers/attendanceController");
const {validateAttendance}=require("../middleware/validate");
const protect = require("../middleware/authMiddleware.js");


router.use(protect);
router.route("/")
    .post(validateAttendance,attendanceController.markAttendance)

module.exports = router;