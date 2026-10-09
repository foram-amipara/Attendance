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

const dailyOverrideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    date: {
        type: String, // Storing as YYYY-MM-DD string for easy querying
        required: true,
        index: true
    },
    slots: [slotSchema]
}, { timestamps: true });

// Ensure unique override per user per day
dailyOverrideSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyOverride", dailyOverrideSchema);
