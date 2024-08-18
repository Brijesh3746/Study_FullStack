const User = require("../models/User");
const Profile = require("../models/Profile");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Send Otp 
exports.sendOtp = async(req,res) => {
    try {
        
        // fetch email from request body
        const {email} = req.body;

        // check User is already exist or not
        const userPresent = await User.findOne({email});

        if(userPresent){
            res.status(401).json({
                success:false,
                message:"User is already registered"
            })
        }

        // generate the Otp
        let otp = otpGenerator(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })

        // check the unique otp generate or not 

        const otpPaylod = {email,otp};

        const otpBody = await OTP.create(otpPaylod);
        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:"Otp send successfully",
        })
        

    } catch (error) {
        console.log("error while generate Otp : ",error);
        res.status(500).json({
            success:false,
            message:"Error in Otp generation"
        });
        process.exit(1);
    }
}

// signup

exports.signUp = async(req,res) => {
    try {
        // fetch details from request body
        const {firstName,lastName,email,contectNumber,accountType,password,confirmPassword,otp} = req.body;

        // check the email is not null
        if(!email || !firstName || !lastName|| !contect || !password|| !confirmPassword|| !otp){
            res.status(400).json({
                success:false,
                message:"Please fill data correctly",
            })
        }

       
        // email validation
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

        // how to validate the email
        if(!emailRegex.test(email)){
            res.status(400).json({
                success:false,
                message:"Please enter valid email"
                })
        }

        // password match
        if(password !== confirmPassword){
            res.status(400).json({
                success:false,
                message:"Password not match"
            })
        }

         // find from database it's availabe or not
         const userEmail = await User.findOne({email});

         // if user found then return
         if(userEmail){
             res.status(400).json({
                 success:false,
                 message:"User already registerd"
             })
         }

        //  find most recent otp from database
        const recentOtp = await User.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp); 
        if(recentOtp.length == 0){
            res.status(400).json({
                success:false,
                message:"Please enter valid otp"
                })
        }
        else if(otp != recentOtp){
            res.status(400).json({
                success:false,
                message:"Otp are not matching"
            })
        }

        // hash the password
        const hashPassword = await bcrypt.hash(password,10);

        // create a Profile
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contectNumber:null,
            
        })


        // // save in db
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashPassword,
            contectNumber,
            accountType,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,


        });

       return res.status(200).json({
            success:true,
            message:"User registerd successfully"
        })
    
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"User does not registerd successfully"

        })
    }
}

// login

exports.login = async(req,res) => {

    try {
        
        // fetch email and password
        const {email,password} = req.body;
        // validate
        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"Please enter email and password"

            })
        }
        // email check 
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not logged in , please signup first"
            })
        }
        
        // jwt token after compare password
        if(await bcrypt.compare(password,user.password)){
            const paylod = {
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(paylod,process.env.JWT_SECRATE,{
                expiresIn:"2h"
            })

            user.token = token;
            user.password = undefined;

            const options = {
                expires:new Date(Date.now() + 3 * 24 * 60 * 60 *1000),
                httpOnly:true,
                
            }
            // create cookie
                res.cookie("token",token,options).status(200).json({
                    success:true,
                    token,
                    user,
                    message:"logged in successfully"
                })
        } 
        else{
            return res.status(401).json({
                success:false,
                message:"Password not match"
            })
        }    
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Login failure , try again"
        })
    }
}

// changePass

exports.changePassword = async(req,res) => {
       try {
        // get data from req ki body
        const {email,oldPassword,newPassword,confirmNewPassword} = req.body;
        
        // validation
        if(!email || !oldPassword || !newPassword || !confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
                })
        }

        // check if email is valid
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Email is not valid"
                })
        }
        // oldPassword match with dbPass
        const isMatch = await bcrypt.compare(oldPassword,user.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Password is Incorrect"
            })
        }

        // old and new pass are not same
        if(newPassword !== oldPassword){
            return res.status(401).json({
                success:false,
                message:"New Password is same as Old Password"
            })
        }


        // newPass and confirm newPass check
        if(newPassword !== confirmNewPassword){
            return res.status(401).json({
                success:false,
                message:"Password does not match"
            })
        }
        
        // hash new Password
        const hashPassword = await bcrypt.hash(newPassword,10);
        
        // update password in db
        await User.findOneAndUpdate(
            {email:email},
            {password:hashPassword},
            {new:true});

        // send mail - pass updated
        require("../utils/mailSender").mailSender(email,"Password Change","Password change successfully");
        // return response 
        // await user.save(); -> it required when new:true is not defined
        res.status(200).json({
            success:true,
            message:"Password Updated Successfully"
            })
            
    
    } 
    catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:"Error Occured during Change Password"
            })
        } 
}