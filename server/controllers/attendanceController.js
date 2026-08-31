const Attendance=require("../models/Attendance");
const Subject=require("../models/Subject");
const wrapAsync=require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

module.exports.markAttendance=wrapAsync(async(req,res)=>{
    const{subjectId,type,status,date}=req.body;
    const userId = req.user.id;
    const targetSub = await Subject.findOne({_id:subjectId, userId});
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
    const userId = req.user.id;

    const subject = await Subject.findOne({ _id: subjectId, userId });//prevented using find here bcz if that subject wont exist then itll return empty array which still means subject exists
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


module.exports.updateAttendance=wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const {status:newStatus,type:newType,date:newDate}=req.body;
    const userId = req.user.id;

    const attendanceRecord = await Attendance.findOne({_id:id,userId});
    if(!attendanceRecord){
        throw new ExpressError(404, "Attendance record not found or unauthorized");
    }

    const targetSub = await Subject.findOne({_id: attendanceRecord.subjectId,userId});
    if(!targetSub){
        throw new ExpressError(404, "subject not found or unauthorized");
    }

    const oldStatus=attendanceRecord.status;
    const oldType=attendanceRecord.type;

    if(oldStatus !== "CANCELLED"){
        if(oldType === "LECTURE"){
            targetSub.totalLecturesConducted = Math.max(0, targetSub.totalLecturesConducted-1);
            if(oldStatus === "PRESENT"){
                targetSub.lecturesPresent = Math.max(0, targetSub.lecturesPresent-1);
            }
        }else if(oldType === "LAB"){
            targetSub.totalLabsConducted = Math.max(0, targetSub.totalLabsConducted-1);
            if(oldStatus === "PRESENT"){
                targetSub.labsPresent = Math.max(0, targetSub.labsPresent-1);
            }
        }
    }

    if(newStatus){
        attendanceRecord.status = newStatus;
    }
    if(newType){
        attendanceRecord.type = newType;
    }
    if(newDate){
        attendanceRecord.date = newDate;
    }

    const currStatus = attendanceRecord.status;
    const currType = attendanceRecord.type;

    if(currStatus!=="CANCELLED"){
        if(currType==="LECTURE"){
            targetSub.totalLecturesConducted++;
            if(currStatus === "PRESENT"){
                targetSub.lecturesPresent++;
            }
        }else if(currType==="LAB"){
            targetSub.totalLabsConducted++;
            if(currStatus === "PRESENT"){
                targetSub.labsPresent++;
            }
        }
    }

    await attendanceRecord.save();
    await targetSub.save();

    res.status(200).json({
        message: "Attendance updated successfully",
        attendanceRecord,
        updatedSubject: targetSub
    });

})






module.exports.deleteAttendance=wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const userId=req.user.id;
    const attendanceRecord=await Attendance.findOne({_id:id,userId});
    if(!attendanceRecord){
        throw new ExpressError(404, "Attendance record not found or unauthorized");
    }

    const targetSub = await Subject.findOne({_id: attendanceRecord.subjectId,userId});
    if(!targetSub){
        throw new ExpressError(404, "subject not found or unauthorized");
    }
    const {status,type}=attendanceRecord;

    if(status !== "CANCELLED"){
        if(type === "LECTURE"){
            targetSub.totalLecturesConducted = Math.max(0, targetSub.totalLecturesConducted-1);
            if(status === "PRESENT"){
                targetSub.lecturesPresent = Math.max(0, targetSub.lecturesPresent-1);
            }
        }else if(type === "LAB"){
            targetSub.totalLabsConducted = Math.max(0, targetSub.totalLabsConducted-1);
            if(status === "PRESENT"){
                targetSub.labsPresent = Math.max(0, targetSub.labsPresent-1);
            }
        }
    }

    await Attendance.findByIdAndDelete(id);
    await targetSub.save();

    res.status(200).json({
        message: "Attendance deleted successfully",
        deletedAttendanceId: id,
        updatedSubject: targetSub
    });

})