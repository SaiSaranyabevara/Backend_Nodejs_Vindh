const Firm = require('../models/Firm');
const  Product = require('../models/Product')
const multer = require("multer");
const path=require('path');


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


const addProduct = async(req,res)=>{
        try {
            const {productName,price,category,bestSeller,description}= req.body;
            const image = req.file ? req.file.filename : undefined;

            const firmId = req.params.firmId;
            const firm = await Firm.findById(firmId);
            if(!firm){
                return res.status(404).json({error:"no firm found"});
            }
            const product = new Product({productName,price,category,bestSeller,description,image,firm:firm._id

            })
            const savedProduct = await product.save();

           firm.products.push(savedProduct);
            await firm.save()

            res.status(200).json(savedProduct)

        } catch (error) {
            console.error(error);
            res.status(500).json({error:"internal server error"})
        }
}

const getProductByFirm = async(req,res)=>{
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm)
        {
            return res.status(400).json({error:"no firm found"});
        }
    const restaurantName =firm.firmName;
    const products = await Product.find({firm:firmId});
    res.status(200).json({restaurantName,products});


    } catch (error) {
         console.error(error);
            res.status(500).json({error:"internal server error"})
  
    }
}

const deleteProductById = async(req,res)=>{
    try {
        const productId= req.params.productId;

        const deletedProduct = await Product.findOneAndDelete(productId);
if(!deletedProduct)
{
    return res.status(400).json({error:"no porduct found"});
}

    } catch (error) {
        console.error(error);
        res.status(500).json({error:"internal server error"})

    }
}



module.exports = {addProduct:[upload.single('image'),addProduct],getProductByFirm,deleteProductById};


// "productName":"dosa",
//     "price":"50",
//     "category":["veg"],
//     "bestSeller":"true",
//     "description":"tasty dosa"

// {
//     "firmName": "dhawat",
//     "area": "rtv",
//     "category": [ "non-veg"],
//     "region": ["south-indian", "north-indian", "chinese"],
//     "offer": "30% off",
//     "image": "pizza.jpeg"
// }
