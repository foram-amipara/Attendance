const express = require("express");
const router = express.Router();
const timetableController = require("../controllers/timetableController");
const { validateTimetable, validateOverride } = require("../middleware/validate");
const protect = require("../middleware/authMiddleware.js");

router.use(protect);

router.route("/")
    .get(timetableController.getTimetable)
    .put(validateTimetable, timetableController.updateTimetable);

router.route("/override")
    .get(timetableController.getOverrides)
    .post(validateOverride, timetableController.setOverride);

module.exports = router;
