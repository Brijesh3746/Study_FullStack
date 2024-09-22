const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDb = () =>{
    mongoose.connect(process.env.MONGODB_URL,{

    })
    .then(() => console.log("DB connection successfully")
    .catch( (error) => {
        console.log("error in connection db");
        console.error(error); 
        process.exit(1);
    })
)
};