if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const authRoutes = require("./routes/authRoutes");
const PORT = process.env.PORT || 8080;

mongoose.connect("mongodb://127.0.0.1:27017/student_attendance")
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => console.log("MongoDB Connection Error:", err));

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hii");
});

app.use("/api/auth", authRoutes);

app.listen(PORT,()=>{
    console.log("server is running");
});