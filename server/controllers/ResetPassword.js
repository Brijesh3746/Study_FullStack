const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt")


// resetPass token for link sending in email
exports.reserPasswordToken = async(req,res) => {
    try {
        //fetch email from req bodi
        const email = req.body.email;
      // // -> deStructuring Process
      // // const {email} = req.body 

        // check user is valid or not
        const user = await User.findOne({email:email});
        if(!user){
            return res.json({
                success:false,
                message:"User is not registed, plz register your self"
            })
        }

        // generate token 
        // why token need bcz 
        // differnt user to differnt link for change pass
        const token = crypto.randomUUID();

        // update user by adding token and expiration time
        // why token entry bcz need in reset pwd 
        const updatedDetails = await User.findOneAndUpdate(
                                                {email:email},
                                                {
                                                    token:token,
                                                    resetPasswordExpires:Date.now() + 5*60*1000
                                                },
                                                {new:true})
            // here new:true meaning is 
            // updated documetn are return 

        // create url
        const url = `http://localhost:3000/update-password/${token}`;

        // send mail 
        await mailSender(email,"Password Reset Link",
                                `Password Reset Link : ${url}`
        )

        // return response

        return res.json({
            success:true,
            message:"Email Sent successfully, please check mail and change pwd",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"Something Went wrong while sending the pwd mail"
        })
    }
}

// reset pass - in db this fuction 

exports.resetPassword = async(req,res) => {
    try {

        // data fetch 
        const {password,confirmPassword,token} = req.body;

        // validation
        if (password !== confirmPassword) {
            return res.json({
                success:false,
                message:"Password are not match"
            });
        }

        // fetch user detail in db using token 
        const userDetails = await User.findOne({token:token});

        // invalid token
        if (!userDetails) {
            return res.json({
                success:false,
                message:"Token is invalid "
            })
        }

        // check token time
        if(User.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token is expires"
            })
        }

        // hadh pwd
        const hashPassword =  bcrypt.hash(password,10);

        // update pwd
        await User.findOneAndUpdate(
            {token:token},
            {password:hashPassword},
            {new:true}
        )
        // return res
        return res.json({
            success:true,
            message:"Password reset successfully"
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error while reset Password"
        })
    }
}