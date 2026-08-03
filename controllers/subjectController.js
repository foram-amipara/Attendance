const Subject=require("../models/Subject");
const wrapAsync=require("../utils/wrapAsync");


module.exports.getSubject=wrapAsync(async(req,res)=>{
    const subject=await Subject.find({userId: req.user.id});
    res.status(200).json(subject);
});

module.exports.createSubject=wrapAsync(async(req,res)=>{
    const {name, targetPercentage,weeklyLectures,weeklyLabs}=req.body;
    const newInfo = new Subject({name,targetPercentage,userId : req.user.id,weeklyLectures,
        weeklyLabs});
    await newInfo.save();
    res.status(201).json({
        message: "Subject created successfully!",
        subject: newInfo
    });
});
