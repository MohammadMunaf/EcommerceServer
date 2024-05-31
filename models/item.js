const mongoose = require('mongoose');
const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: {
        type: Number
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const Item = mongoose.model("Item", itemSchema);
// const firstItem=new Item({name:"car",description:"sadasdas",url:"jasdas",price:130});
// firstItem.save();
module.exports = Item;