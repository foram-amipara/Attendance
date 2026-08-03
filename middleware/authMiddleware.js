const jwt = require("jsonwebtoken");
const wrapAsync=require("../utils/wrapAsync");
const User=require("../models/User");

const protect = wrapAsync(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }
    if(!token){
        res.status(401);
        throw new Error("Not authorized, no token");
    }
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user=await User.findById(decode.id).select("-password");
        if(!req.user){
            res.status(401);
            throw new Error("Not authorized , user no longer exists");
        }
        next();
    }catch(error){
        res.status(401);
        throw new Error("Not authorized,token failed");
    }
});

module.exports=protect;
