const mongoose=require("mongoose");

const attendanceSchema = new mongoose.Schema({  
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Subject",
    },
    type: { 
        type: String,
        enum: ["LECTURE", "LAB"],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["PRESENT", "ABSENT", "CANCELLED"],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);