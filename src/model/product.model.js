const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const product = new Schema({
    product_name: { type: String, default: 'Product Default', required:true },
    price:{type:Number, required:true },
    product_properties:{type:String,required:true},
    description:{type:String, required:true},
    imgUrl:{type:String, required:true}
},{ timestamps:true } );
 
module.exports = mongoose.model('product', product);