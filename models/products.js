import mongoose, { model } from "mongoose";

const productSchema  = mongoose.Schema({
    productId : {
        type : String,
        required : true,
        unique : true
    },
    productName : {
        type : String,
        required : true , 
    },
    altName : [
        {
            type : String
        }
    ],
    description :{
        type : String,
        required : true,
    },
    imges : [
        {
            type : String ,
        }
    ],
    labelledPrice : {
        type : Number,
        required  : true,
    },
    price : {
        type : Number , 
        required : true
    },
    stock : {
        type : Number,
        required : true,
    },
    isAvailable : {
        type : Boolean,
        required : true ,
        default : true,
    }
    
})

const Product = mongoose.model("products" , productSchema)  // param 1 = name of the collection that save in the database , param 2 = name of the Schema
export default Product