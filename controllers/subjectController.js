const Subject=require("../models/Subject");
const wrapAsync=require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { calculateBunkOrNeed } = require("../utils/attendanceCalculator");



const buildSub = (subject) => {
    const lec = calculateBunkOrNeed(
        subject.lecturesPresent,
        subject.totalLecturesConducted,
        subject.targetPercentage
    );

    const lab = calculateBunkOrNeed(
        subject.labsPresent,
        subject.totalLabsConducted,
        subject.targetPercentage
    );

    const totalConducted = subject.totalLecturesConducted + subject.totalLabsConducted;
    const totalPresent = subject.lecturesPresent + subject.labsPresent;
    const overAll =calculateBunkOrNeed(
        totalPresent,
        totalConducted,
        subject.targetPercentage
    )

    return {
        subjectId: subject._id,
        name: subject.name,
        targetPercentage: subject.targetPercentage,
        lectures: lec,
        labs:lab,
        overall: overAll
    };
}


module.exports.getSubjectById= wrapAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const subject = await Subject.findOne({ _id: id, userId });
    if (!subject) {
        throw new ExpressError(404, "Subject not found or unauthorized");
    }

    const stats = buildSub(subject);

    res.status(200).json({
        subject,
        stats
    });
});




module.exports.getSubject=wrapAsync(async(req,res)=>{
    const subject=await Subject.find({userId: req.user.id});
    res.status(200).json(subject);
});

module.exports.createSubject=wrapAsync(async(req,res)=>{
    const {name, targetPercentage,weeklyLectures,weeklyLabs,priorLecturesConducted = 0,priorLecturesPresent = 0,priorLabsConducted = 0, priorLabsPresent = 0}=req.body;
    const newInfo = new Subject({name,targetPercentage,userId : req.user.id,weeklyLectures,weeklyLabs,priorLecturesConducted,priorLecturesPresent,priorLabsConducted,priorLabsPresent,totalLecturesConducted: priorLecturesConducted,lecturesPresent: priorLecturesPresent,totalLabsConducted: priorLabsConducted,labsPresent: priorLabsPresent});
    await newInfo.save();
    res.status(201).json({
        message: "Subject created successfully!",
        subject: newInfo
    });
});


module.exports.updateSubject=wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const updateSub=await Subject.findOneAndUpdate(
    {_id:id,userId:req.user.id},
    {$set:req.body},
    { new: true, runValidators: true }
    )
    
    if(!updateSub){
        throw new ExpressError(404, "Subject not found");
    }
    res.status(200).json(updateSub);
})

module.exports.deleteSubject=wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const deleteSub=await Subject.findOneAndDelete({_id:id,userId:req.user.id});
    if(!deleteSub){
        throw new ExpressError(404, "Subject not found");
    }
    res.status(200).json({message: "subject deleted",id});
})
