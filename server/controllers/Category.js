const Category = require("../models/Category");

exports.createCategory = async(req,res) => {
    try {

        // fetch data from req ki body
        const {name,description} = req.body;

        // validation
        if(!name || !description) {
            return res.status(400).json({
                success:false,
                message: "Please fill all the fields!"
            
            });
        }

        // entry in db
        const categoryDetails = await Category.create({
            name:name,
            description:description
        });

        return res.status(200).json({
            success:true,
            message: "Tag created successfully!",
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


exports.showAllCategories = async(req,res) => {
    try {
        const allCategory = await Category.find({},{name:true,description:true});

        return res.status(200).json({
            success:true,
            message: "All tags fetched successfully!",
            allTags
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}