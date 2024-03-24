const mongoose=require('mongoose');
const itemSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    price:{
        type:Number
    },
    category:{
        type:String,
        required:true
    }
})
const Item=mongoose.model("Item",itemSchema);
// const firstItem=new Item({name:"car",description:"sadasdas",url:"jasdas",price:130});
// firstItem.save();
module.exports=Item;