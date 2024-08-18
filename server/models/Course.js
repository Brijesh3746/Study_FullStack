const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        reqired:true,
    },
    courseDescription:{
        type:String,
        reqired:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true    
    },
    whatYouWillLearn:{
        type:String,
        required:true,
    },
    courseContent:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        required:true
        }
    ],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReviews"
        }
    ],
    price:{
        type:number,
        required:true
    },
    thumnail:{
        type:String
    },
    tag: {
		type: [String],
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
    studentEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true        
        }
    ]
      

});

module.exports = mongoose.model("Course",courseSchema);