const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");
const {uploadImageToCloudinary} = require("../utils/imageUploder");



// createCourse
exports.createCourse = async(req,res) =>{
    try {
        // fetch data 
        const {courseName,courseDescription,whatYouWillLearn,price,category} = req.body;

        // thumbnail -> catch aa skta ahi
        const thumbnail = req.files.thumbnailImage;

        // if not found anyone
        if(!thumbnail || !courseName || !courseDescription || !whatYouWillLearn || !price || !category ){
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
                });
        }

        // check for instructor bcz
        // in model instructor is availabe that's why used
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: ",instructorDetails);
        // check krna hai user id or instructor id same ya different


        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Not Found"
                });
        }

        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: "Tag Details Not Found"
                });
        }

        // upload img to cloudinary
        const thumbnailImg = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        // Entry in db
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            // instructor:instructorDetails._id
            instructor:userId,
            whatYouWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImg.secure_url,
           

        });

        // // add new Course into user schema 
        // await User.findByIdAndUpdate(
        //     {id:instructorDetails._id},
        //     {
        //         $push:{
        //             courses:newCourse._id
        //           }
        //     },
        //     {new:true}
        // )

        // // add new tag into tag schema
        // await Category.findByIdAndUpdate(
        //     {id:tagDetails._id},
        //     {
        //         $push:{
        //             courses:newCourse._id
        //         }
        //     },
        //     {new:true}
        // )

        // add new Course into user schema 
        await User.findByIdAndUpdate(
            {id:userId},
            {
                $push:{
                    courses:newCourse._id
                  }
            },
            {new:true}
        )

        // add new tag into tag schema
        await Category.findByIdAndUpdate(
            {id:category},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        )

        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse
        })
        



    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error While create a course"
        })
    }
}

// getAllCourse

exports.showAllCourses = async(req,res) => {
    try {
        // Todo : check the parameter is always availabel
        const allCourseDetails = await Course.find();

        return res.status(200).json({
            success:true,
            message:"Get All Courses",
        })
    } catch (error) {
        console.error("Error At Get All Courses:",error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

