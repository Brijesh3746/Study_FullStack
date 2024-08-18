const Section = require("../models/Section");
const SubSection  = require("../models/SubSection");
const uploadImageToCloudinary = require("../utils/imageUploder")

// create a SubSection
exports.createSubSection = async (req,res) => {
    try {
        // fetch the Data
        const {sectionId,title,timeDuration,description} = req.body;

        // fetch the video
        const video = req.files.videoFile;

        // validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                    error:"Please fill all the fields" 
                });
            }
        //Upload to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

        // create sub section
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            video:uploadDetails.secure_url,
        });

        // update the section by add sub section ObjectId
        const updatedDetails = await Section.findByIdAndUpdate({_id:sectionId},
                                                {
                                                    $push:{
                                                        subSections:subSectionDetails._id
                                                    }
                                                },
                                                {new:true}
        );

        // retutn the response
        return res.status(200).json({
            success:true,
            message:"Sub Section Created Successfully",
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error While Creating a Sub-Seciton"
        })
    }
}