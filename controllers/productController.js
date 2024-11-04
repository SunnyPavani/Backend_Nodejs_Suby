const Firm = require('../models/Firm');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
    }
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
    
        console.log("Received data:", { productName, price, category, bestSeller, description, image });
    
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            console.log("Firm not found");
            return res.status(404).json({ error: "No firm found" });
        }
    
        const product = new Product({
            productName,
            price,
            category,
            bestSeller,
            description,
            image,
            firm: firm._id
        });
    
        console.log("Product to be saved:", product);
    
        const savedProduct = await product.save();
        
    
        firm.products.push(savedProduct);
        await firm.save();
    
        res.status(200).json(savedProduct);
    } catch (error) {
        console.error("Product controller error:", error);
        res.status(500).json({ error: "Product controller error" });
    }
    
};



const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }
        

        const restruntName = firm.firmName
        const products = await Product.find({ firm: firmId });
        res.status(200).json({ restruntName, products });
    } catch (error) {
        console.error("Product controller error:", error);
        res.status(500).json({ error: "Product controller error" });
    }
};



const deletProductById = async(req,res)=>{
    try {
        const productId = req.params.productId;
        const deletProduct = await Product.findByIdAndDelete(productId)
        if(!deletProduct){
            return res.status(500).json({error:"no product"})
        }


    } catch (error) {
        console.error("Product controller error:", error);
        res.status(500).json({ error: "Product controller error" });
    }
}

module.exports = {
    addProduct: [upload.single('image'), addProduct,],getProductByFirm,deletProductById
};
