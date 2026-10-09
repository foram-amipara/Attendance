const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    type: {
        type: String,
        enum: ["LECTURE", "LAB"],
        required: true,
        default: "LECTURE"
    },
    order: {
        type: Number,
        required: true
    }
}, { _id: false });

const timetableSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    monday: [slotSchema],
    tuesday: [slotSchema],
    wednesday: [slotSchema],
    thursday: [slotSchema],
    friday: [slotSchema],
}, { timestamps: true });

module.exports = mongoose.model("Timetable", timetableSchema);
