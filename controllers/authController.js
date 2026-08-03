const wrapAsync=require("../utils/wrapAsync");
const User = require("../models/User");
const generateToken=require("../utils/generateJwt");


module.exports.signUp = wrapAsync(async (req,res)=>{
    const {username,password,email}=req.body;
    const userFound=await User.findOne({username});
    if(userFound){
        throw new ExpressError(400, "User already exists");
    }
    const newUser = await User.create({username,password,email});
    res.status(201).json({
        _id:newUser._id,
        username:newUser.username,
        token:generateToken(newUser._id),
    });
});


module.exports.logIn = wrapAsync(async (req,res)=>{
    const {email,password}=req.body;
    const user =await User.findOne({email});
    if(user && (await user.comparePw(password))){
        res.json({
            _id: user._id,
            email:user.email,
            token: generateToken(user._id),
        });
    }else{
        throw new ExpressError(401, "invalid email or password");
    }

})