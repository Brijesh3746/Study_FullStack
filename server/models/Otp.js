const mongoose = require("mongoose");
const { mailSender } = require("../utils/mailSender");

const OtpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60*1000
    }

});

async function sendMailVerfication(email,otp) {
    try {
        let mailResponse = await mailSender(email,"Verificaition of Otp",otp);
        console.log("Mail Response is : ",mailResponse);

    }
    catch(error){
        console.log("Error occured while send mail verification:",error);
        throw error; 
    }
}

// Pre middleware 
OtpSchema.pre("save",async function(next){
   try{
        await sendMailVerfication(this.email,this.otp);
        next();
   }
   catch(error){
    console.log("error occoured during pre middleware",error);
   }
})

module.exports = mongoose.model("Otp",OtpSchema);