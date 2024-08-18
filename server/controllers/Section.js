const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req,res) => {
    try {
        // data fetch
        const {sectionName,courseId} = req.body;

        // data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success:false,
                message:"Data fill Properly"
            })
        }
        // create Section
        const newSection = await Section.create({sectionName});
        // update the course in add the section object id
        const updatedDetails = await Course.findByIdAndUpdate(
                                    courseId,
                                    {
                                        $push:{
                                            courseContent:newSection._id
                                        }
                                    },
                                    {new:true}
        )
        // HW : here show only Objid -> Show actual data populate

        // return response
        return res.status(200).json({
            success:true,
            message:"Section Created Successfully",
            data:updatedDetails 
            })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error during create Section"
        })
    }
}

// update the course
exports.updateSection = async(req,res) => {
    try {
        // data fetch
        const {sectionName,sectionId} = req.body;

        // data validation
        if (!sectionName) {
            return res.status(400).json({
                success:false,
                message:"Properly fill data"
            })
        }
        
        // update data 
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
                                                            {sectionName},
                                                            {new:true});

        // return response
        return res.status(200).json({
            success:true,
            message:"Update Data in the Section "
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error during Update Section"
        })
    }
}

// delete section
exports.deleteSection = async (req,res) => {
    try {
        // get id in Params
        const {sectionId} = req.params;

        // delete Section
        const deleteSectionDetails = await Section.findByIdAndDelete(sectionId);

        // course update bcz section is deleted
        // const updatedCourseDetails = await Course.findByIdAndUpdate(
        //                                             sectionId,
        //                                             {
        //                                                 $pull:{
        //                                                     courseContent:sectionId
        //                                                 }
        //                                             }
        // );
        return res.status(200).json({
            success:true,
            message:"Delete Section "
        })

        
    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Error during Delete Section"
        })
    }
}