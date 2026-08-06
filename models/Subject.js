const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true, 
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        targetPercentage: {
            type: Number,
            required: true,
            default: 75,
            min: 0,
            max: 100,
        },
        weeklyLectures: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        weeklyLabs: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
            priorLecturesConducted: {
            type: Number, 
            default: 0
        },
        priorLecturesPresent: {
            type: Number,
            default: 0
        },
        priorLabsConducted: {
            type: Number,
            default: 0
        },
        priorLabsPresent: {
            type: Number,
            default: 0
        },
        totalLecturesConducted: {
            type: Number,
            default: 0,
            min: 0,
        },
        lecturesPresent: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalLabsConducted: {
            type: Number,
            default: 0,
            min: 0,
        },
        labsPresent: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Subject", subjectSchema);