if (process.env.Node_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
const users = require("./models/user");
const items = require("./models/item");
const { v4: uuidv4 } = require("uuid");
uuidv4();
app.use(cors({ 
    origin: ['https://ecommerce-client-beige-six.vercel.app', 'http://localhost:3000']
  }));


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    const { q} = req.query;
    let products = [];
    try {
        if (q === "All") {
            products = await items.find({}).limit(5);
            res.json(products);
        }
        else {
            products = await items.find({ category: q }).limit(5).exec();
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
app.post('/upload', async (req, res) => {
    const data = req.body;
    let item = new items();
    item.name = data.Name;
    item.description = data.Description;
    item.url = data.url;
    item.price = data.price;
    item.category = data.category;
    await item.save();
})

app.get('/search', async (req, res) => {
    const { q } = req.query;
    let product=[];
    try {
        product = await items.find({ name: q });
        if (product.length === 0) {
            console.log("not found");
        }
        else res.json(product);
    } catch (e) {
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

app.get('*',async(req,res)=>{
    res.send("RUNNING");
    let products = [];
    try {
        products = await items.find({});
        res.json(products);
    } catch (e) {
        console.log(`e-->${e}`);
    }
})

app.listen(PORT, () => {
    console.log("Listining at 3001 Port");
})
