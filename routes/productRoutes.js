
// const express = require("express");
// const productController = require("../controllers/productController");
// const router= express.Router();

// router.post("/add-product/:firmId",productController.addProduct);
// router.get("/:firmId/products",productController.getProductByFirm);

// router.get('/uploads/:imageName',(req,res)=>{
//     const imageName=req.params.imageName;
//     req.headersSent('Content-Type','image/jpeg');
//     res.sendFile(path.join(__dirname,'..','uploads','imageName'));
    
// });

// router.delete('/:productId',productController.deleteProductById);

// module.exports = router;

const express = require("express");
const productController = require("../controllers/productController");
const path = require("path");

const router = express.Router();

// Add a new product
router.post("/add-product/:firmId", productController.addProduct);

// Get all products for a firm
router.get("/:firmId/products", productController.getProductByFirm);

// Serve uploaded images
router.get("/uploads/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    res.setHeader("Content-Type", "image/jpeg");
    res.sendFile(path.join(__dirname, "..", "uploads", imageName));
});

// ✅ Fix: Include firmId in delete route
router.delete("/:productId", productController.deleteProductById);

module.exports = router;
