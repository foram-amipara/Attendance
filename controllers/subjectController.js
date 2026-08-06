const Subject=require("../models/Subject");
const wrapAsync=require("../utils/wrapAsync");


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
