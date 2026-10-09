const Timetable = require("../models/Timetable");
const DailyOverride = require("../models/DailyOverride");
const wrapAsync = require("../utils/wrapAsync");

// Timetable
module.exports.getTimetable = wrapAsync(async (req, res) => {
    let timetable = await Timetable.findOne({ userId: req.user.id }).populate([
        "monday.subjectId", 
        "tuesday.subjectId", 
        "wednesday.subjectId", 
        "thursday.subjectId", 
        "friday.subjectId"
    ]);

    if (!timetable) {
        // Return empty structure if none exists
        return res.status(200).json({
            monday: [], tuesday: [], wednesday: [], thursday: [], friday: []
        });
    }

    res.status(200).json(timetable);
});

module.exports.updateTimetable = wrapAsync(async (req, res) => {
    const { monday, tuesday, wednesday, thursday, friday } = req.body;
    
    let timetable = await Timetable.findOne({ userId: req.user.id });
    
    if (timetable) {
        timetable.monday = monday || timetable.monday;
        timetable.tuesday = tuesday || timetable.tuesday;
        timetable.wednesday = wednesday || timetable.wednesday;
        timetable.thursday = thursday || timetable.thursday;
        timetable.friday = friday || timetable.friday;
        await timetable.save();
    } else {
        timetable = await Timetable.create({
            userId: req.user.id,
            monday: monday || [],
            tuesday: tuesday || [],
            wednesday: wednesday || [],
            thursday: thursday || [],
            friday: friday || []
        });
    }
    
    res.status(200).json({
        message: "Timetable updated successfully",
        timetable
    });
});

// Daily Overrides
module.exports.getOverrides = wrapAsync(async (req, res) => {
    const { stDate, endDate } = req.query; // YYYY-MM-DD
    
    let query = { userId: req.user.id };
    if (stDate && endDate) {
        query.date = { $gte: stDate, $lte: endDate };
    } else if (stDate) {
        query.date = stDate;
    }

    const overrides = await DailyOverride.find(query).populate("slots.subjectId");
    res.status(200).json(overrides);
});

module.exports.setOverride = wrapAsync(async (req, res) => {
    const { date, slots } = req.body; // date in YYYY-MM-DD
    
    let override = await DailyOverride.findOne({ userId: req.user.id, date });
    
    if (override) {
        override.slots = slots;
        await override.save();
    } else {
        override = await DailyOverride.create({
            userId: req.user.id,
            date,
            slots
        });
    }
    
    res.status(200).json({
        message: "Schedule override saved successfully",
        override
    });
});
