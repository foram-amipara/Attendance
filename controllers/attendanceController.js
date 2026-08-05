const Attendance=require("../models/Attendance");
const Subject=require("../models/Subject");
const wrapAsync=require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

module.exports.markAttendance=wrapAsync(async(req,res)=>{
    const{subjectId,type,status,date}=req.body;
    const targetSub = await Subject.findOne({_id:subjectId, userId:req.user.id});
    if(!targetSub){
        throw new ExpressError(404, "Subject not found or unauthorized");
    }
    const attendanceRecord = await Attendance.create({subjectId, userId:req.user.id,type,status,date});
    if (status !== "CANCELLED") {
        if (type === "LECTURE") {
            if (status === "PRESENT") {
                targetSub.totalLecturesConducted++;
                targetSub.lecturesPresent++;
            }
            if (status === "ABSENT") {
                targetSub.totalLecturesConducted++;
            }
        }
        if (type === "LAB") {
            if (status === "PRESENT") {
                targetSub.totalLabsConducted++;
                targetSub.labsPresent++;
            }
            if (status === "ABSENT") {
                targetSub.totalLabsConducted++;
            }
        }
        await targetSub.save();
    }

    res.status(201).json({
        message: "attendance marked successfully",
        attendanceRecord,
        updatedSubject: targetSub
    });

})