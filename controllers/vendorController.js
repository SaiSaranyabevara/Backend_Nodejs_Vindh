const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require("dotenv");

dotEnv.config();

const secretKey = process.env.whatIsYourName; // Ensure you have JWT_SECRET in .env

const vendorRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if email already exists
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json({ error: "Email already taken" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new vendor
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword,
        });

        const savedVendor = await newVendor.save();

        res.status(201).json({ message: "Vendor registered successfully", vendor: savedVendor });
        console.log("Vendor registered successfully:", savedVendor);
    } catch (error) {
        console.error("Error in vendorRegister:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if vendor exists
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "7d" });
        const vendorId=vendor._id;
        res.status(200).json({ success: "Login successful", token,vendorId });
        console.log(email, "this token", token);
    } catch (error) {
        console.error("Error in vendorLogin:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate("firm"); // ✅ Ensure "Firm" is correctly referenced
        res.json({ vendors });
    } catch (error) {
        console.error("Error in getAllVendors:", error.stack); // Improved error log
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

const getVendorById = async (req, res) => {
    const vendorId = req.params.vendorId;  // ✅ Ensure the param matches your route

    try {
        const vendor = await Vendor.findById(vendorId).populate("firm");
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        const vendorFirmId = vendor.firm.length > 0 ? vendor.firm[0]._id : null;
        
        // ✅ Send the full vendor object along with firm details
        res.status(200).json({ vendor, vendorFirmId });
    } catch (error) {
        console.error("Error in getVendorById:", error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};



module.exports = { vendorRegister, vendorLogin, getAllVendors,getVendorById };
