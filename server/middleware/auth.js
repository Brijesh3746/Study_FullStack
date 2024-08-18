const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// auth
exports.auth = async(req,res,next) => {
    try {
        const token = req.body.token || req.cookie.token || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is Missing"
            })
        }

        // verify the token 
            //decode -> we can pass in paylod is here in output
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRATE);
            req.user = decode;
        } 
        catch(err){
            return res.status(401).json({
                success:false,
                message:"Invalid Token"
            })
        }
        next();
    } 
    catch (error) {
        return res.status(401).json({
            success:false,
            message:"Error fetching during the validation of token"
        })
    }
   
}

// isStudent
exports.isStudent = async(req,res,next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"You are not a student"
                })
        }
        next();
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error fetching during the Student Protected route,try again"
        })
    }
}

// isInstructor
exports.isInstructor = async(req,res,next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"You are not a Instructor"
                })
        }
        next();
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error fetching during the Instructor Protected route,try again"
        })
    }
}

// isAdmin
exports.isAdmin = async(req,res,next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"You are not a Admin"
                })
        }
        next();
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error fetching during the Admin Protected route,try again"
        })
    }
}