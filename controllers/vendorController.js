const Vendor = require('../models/Vendor'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');

// Load environment variables from .env file
dotEnv.config();

// Secret key for JWT
const secretKey = process.env.WhatIsYourName;

// Vendor Registration function
const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if email already exists
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json("Email already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new vendor instance
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });

        // Save the new vendor to the database
        await newVendor.save();

        res.status(201).json({ message: "Vendor registered successfully"});
        console.log("Vendor registered successfully");
    } catch (error) {
        res.status(500).json({ message: "Vendor registration failure" });
        console.log(`Vendor registration failure: ${error}`);
    }
};

// Vendor Login function
const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate a JWT token for the vendor's ID on successful login
        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: '5h' });

        // Respond with the token on successful login
        res.status(200).json({ success: "Login Successful", token });
        console.log("Login Successful:", email, "Token:", token);
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
        console.log(`Login failure: ${error}`);
    }
};


const getAllVendors = async(req,res)=>{
    try {
        const vendors = await Vendor.find().populate('firm')
        res.json({vendors})
    } catch (error) {
        console.log("firm added error:" ,error)
        res.status(500).json({error:"intertnal server error"})
   }
}




const getVendorById = async (req, res) => {
    const vendorId = req.params.apple;
    try {
        // Await the result of the query
        const vendor = await Vendor.findById(vendorId).populate('firm');
        
        // Check if the vendor exists
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        // Send the found vendor data
        res.status(200).json({ vendor });
    } catch (error) {
        console.log("Error fetching vendor:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



module.exports = { vendorRegister, vendorLogin , getAllVendors , getVendorById};
