// const Vendor = require('../models/Vendor');
// const dotenv = require("dotenv");
// const jwt = require('jsonwebtoken');

// dotenv.config();

// const secretKey = process.env.whatIsYourName;
// if (!secretKey) {
//     throw new Error("Secret key is missing in .env");
// }

// const verifyToken = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;
//         // if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         //     return res.status(401).json({ error: "Token is required" });
//         // }

//         // const token = authHeader.split(" ")[1];
//         // console.log("Received Token:", token);

//         const decoded = jwt.verify(token, secretKey);
//         console.log("Decoded Token:", decoded);

//         const vendor = await Vendor.findById(decoded.vendorId);
//         if (!vendor) {
//             return res.status(404).json({ error: "Vendor not found" });
//         }

//         req.vendorId = vendor._id;
//         next();
//     } catch (error) {
//         console.error("Token Verification Error:", error);
//         return res.status(401).json({ error: "Invalid token" });
//     }
// };

// module.exports = verifyToken;
const Vendor = require('../models/Vendor');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');

dotenv.config();

const secretKey = process.env.whatIsYourName; // Your secret key from .env
if (!secretKey) {
    throw new Error("Secret key is missing in .env");
}

const verifyToken = async (req, res, next) => {
    try {
        // Token from the body
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ error: "Token is required" });
        }

        // Log the received token (useful for debugging)
        console.log("Received Token:", token);

        // Verify the token using JWT
        const decoded = jwt.verify(token, secretKey);

        // Log the decoded token (useful for debugging)
        console.log("Decoded Token:", decoded);

        // Find the vendor from the decoded token's vendorId
        const vendor = await Vendor.findById(decoded.vendorId);
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        // Attach the vendorId to the request object and proceed
        req.vendorId = vendor._id;
        next();
    } catch (error) {
        console.error("Token Verification Error:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = verifyToken;

