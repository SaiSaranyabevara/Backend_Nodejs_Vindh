const multer = require('multer');
const path = require('path');
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = './uploads';


// Set up Multer storage engine
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

// Initialize Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB file size limit
});
const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;

        // Ensure firmName is not null or empty
        if (!firmName) {
            return res.status(400).json({ message: "Firm name is required!" });
        }

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id  // Correct reference to vendor
        });

        const savedFirm = await firm.save();
        vendor.firm.push(savedFirm._id);
        await vendor.save();

        res.status(201).json({ message: "Firm added successfully!", firm: savedFirm });
    } catch (error) {
        console.error("Error adding firm:", error);
        res.status(500).json({ message: "Error adding firm", error: error.message });
        // console.log(firmname);
    }
};

const deleteFirmById = async(req,res)=>{
    try {
        const firmId= req.params.firmId;

        const deletedFirm = await Firm.findOneAndDelete(firmId);
if(!deletedFirm)
{
    return res.status(400).json({error:"no firm found"});
}

    } catch (error) {
        console.error(error);
        res.status(500).json({error:"internal server error"})

    }
}


// Export functions
module.exports = { addFirm:[upload.single('image'),addFirm ],deleteFirmById};
