const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Folder to store uploaded images
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + Path2D.extname(file.originalname)); // Unique filename with timestamp
    }
  });
  const upload = multer({ storage: storage});

const addFirm = async(req,res)=>{
    try {
        const {firmName, area,category,region,offer} = req.body;
    const image=req.file? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId)
    if(!vendor){
        res.status(404).json({message:"vendor not founded"})
    }

    const firm = new Firm({
        firmName, area,category,region,offer,image,vendor: vendor._id
    })

   const saveFirm = await firm.save();
   vendor.firm.push(saveFirm)
   await vendor.save()

    return res.status(200).json({message:"firm added successfully"})
    } 
    catch (error) {
         console.log("firm added error:" ,error)
         res.status(500).json({error:"intertnal server error"})
    }
    
}


const deletFirmById = async(req,res)=>{
  try {
      const firmId = req.params.firmId;
      const deletProduct = await Firm.findByIdAndDelete(FirmId)
      if(!deletProduct){
          return res.status(500).json({error:"no product"})
      }


  } catch (error) {
      console.error("Product controller error:", error);
      res.status(500).json({ error: "Product controller error" });
  }
}


module.exports = {addFirm:[upload.single('image'),addFirm] , deletFirmById}