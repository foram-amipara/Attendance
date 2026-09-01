import axiosInstance from "./axiosInstance";

export const signupApi=async(userData)=>{
    const res=await axiosInstance.post("/auth/signup",userData);
    return res.data;
}

export const loginApi=async(credentials)=>{
    const res=await axiosInstance.post("/auth/login/",credentials);
    return res.data;
}