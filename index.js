if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
app.use(express.json())
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
const users = require("./models/user");
const items = require("./models/item");
const { v4: uuidv4 } = require("uuid");
const multer = require('multer');
const { storage } = require('./cloudinary');
const upload = multer({ storage });
// const methodOverride=require('medthod-override');
uuidv4();
app.use(cors({
    origin: ['https://ecommerce-client-ivory-gamma.vercel.app', 'http://localhost:3000']
}));

// https://ecommerce-client-j42v08rim-munafs-projects-7c7651d4.vercel.app

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));

//use the client app

const dburl = process.env.DB_URL;



mongoose.connect(dburl, {
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



//related to product

app.get('/products', async (req, res) => {
    const { q } = req.query;
    const { l } = req.query;
    let products = [];
    try {
        if (q === "All") {
            products = await items.find({}).limit(l);
            res.json(products);
        }
        else {
            products = await items.find({ category: q });
            res.json(products);
        }
    } catch (e) {
        console.log(`e-->${e}`);
    }
})
app.get('/show/:id', async (req, res) => {
    const Id = req.params.id;
    //console.log(Id);
    try {
        const item = await items.findById(Id);
        if (!item) {
            console.log("Item not found");
        }
        res.json(item);
    } catch (e) {
        console.log(`Error-->${e}`);
    }
})
// app.get('/item/add',(req,res)=>{
//     //open input page;
// })
app.post('/upload', upload.array('images'), async (req, res) => {
    const data = req.body;
    let item = new items();
    item.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    item.name = data.Name;
    item.description = data.Description;
    item.price = data.price;
    item.category = data.category;
    await item.save();
    console.log(item);
    res.json("upload successfull");
})

app.get('/search', async (req, res) => {
    const { q } = req.query;
    let product = [];
    try {
        product = await items.find({ $or: [{ name: q }, { category: q }] });
        if (product.length === 0) {
            console.log("not found");
        }
        else res.json(product);
    } catch (e) {
        console.log(`Error-->${e}`);
    }
})

app.get('/edit/:id', async (req, res) => {
    const Id = req.params.id;
    try {
        const prod = await items.findById(Id);
        return res.json(prod);
    } catch (e) {
        console.log(`Error-->${e}`);
    }
})

app.patch('/edit/:id',async(req,res)=>{
    const Id=req.params.id;
    const {Name,Description,price,category}=req.body;
    try{
        const oldProduct=await items.findById(Id);
        if(oldProduct.Name!==Name){
            await items.updateOne({_id:Id},{name:Name})
               
        }
        if(oldProduct.description!==Description){
            await items.updateOne({_id:Id},{description:Description})
        }
        if(oldProduct.price!==price){
            await items.updateOne({_id:Id},{price:price})
            
        }
        if(oldProduct.category!==category){
            await items.updateOne({_id:Id},{$set:{category:category}});
        }
        const newProduct=await items.findById(Id);
        res.json(newProduct)
    }catch(e){
        console.log(`Error-->${e}`);
    }
})

app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await items.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (e) {
        console.error(`Error: ${e}`);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.get('*', async (req, res) => {
    let products = [];
    try {
        products = await items.find({}).limit(10);
        res.json(products);
    } catch (e) {
        console.log(`e-->${e}`);
    }
})

app.listen(PORT, () => {
    console.log("Listining at 3001 Port");
})
