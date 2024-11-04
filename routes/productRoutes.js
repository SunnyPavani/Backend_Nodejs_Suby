const productController = require('../controllers/productController');
const express = require('express');

const router = express.Router();

// Define routes for adding and retrieving products
router.post('/add-product/:firmId', productController.addProduct);
router.get('/:firmId/products', productController.getProductByFirm);

router.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName;
    res.headersSent('Content-Type' , 'image/jpeg');
    res.sendFile(path.join(__dirname,'..','uploads',imageName));
})

router.delete('/:productId',productController.deletProductById)

// Export the router object
module.exports = router;
