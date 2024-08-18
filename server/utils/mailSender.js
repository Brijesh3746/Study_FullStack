
const nodemailer = require("nodemailer");
require("dotenv").config();


exports.mailSender = async (email,title,body) => {
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        });

        // send the mail

        let info  = transporter.sendMail({
            from:"Brijesh Varsani",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        });

        console.log("info:",info);
        return info;

    }
    catch(error){
        console.log(error);
    }
}