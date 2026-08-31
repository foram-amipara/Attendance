if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ExpressError = require("./utils/ExpressError");
const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student_attendance")
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => console.log("MongoDB Connection Error:", err));

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hii");
});

app.use("/api/auth", authRoutes);

app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, `Cannot ${req.method} ${req.originalUrl}`));
})


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong on the server";

    res.status(statusCode).json({
        success: false,
        error: {
            statusCode,
            message
        }
    });
});

app.listen(PORT,()=>{
    console.log("server is running");
});