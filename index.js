const express = require('express');
const dotEnv = require('dotenv');
const mongoose =require('mongoose');
const vendorRouter = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes')
const productRoutes = require('./routes/productRoutes');
const path = require('path')

const app = express()

const port =process.env.PORT || 4000;

dotEnv.config()
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongo db connect successfull"))
.catch((error)=>console.log(`mongo db connect failur ${error}`))


app.use(bodyParser.json());
app.use('/vendor' , vendorRouter)
app.use('/firm',firmRoutes)
app.use('/product', productRoutes);
app.use('/uploads',express.static('uploads'))

app.listen(port,()=>{
    console.log("server start and run  4000 ")
})

app.use('/',(req,res)=>{
    res.send("<h1>sserver start for home page </h1>")
})