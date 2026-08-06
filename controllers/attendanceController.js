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

});



module.exports.getAttendance=wrapAsync(async (req,res)=>{
    const { subjectId } = req.params;
    const { stDate, endDate } = req.query;
    const userId = req.user.id || req.user._id;

    const subject = await Subject.findOne({ _id: subjectId, userId });//prevented using find here bcz if that subject wont exist then ill return empty array which still means subject exists
    if(!subject){
        throw new ExpressError(404, "Subject not found or unauthorized");
    }
    let query={subjectId,userId};
    if(stDate && endDate){
        query.date={
            $gte: new Date(stDate),
            $lte: new Date(endDate)
        };
    }else if(stDate){
        query.date={$gte: new Date(stDate)};
    }else if(endDate){
        query.date={$lte: new Date(endDate)};
    }

    const attendanceRecord = await Attendance.find(query).sort({ date: 1 });

    res.status(200).json({
        message: "Attendance records fetched successfully",
        count: attendanceRecord.length,
        attendanceRecord
    });
})