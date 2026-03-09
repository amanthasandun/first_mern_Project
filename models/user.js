import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    email : {
        type: String,
        required : true , 
        unique : true ,
    },
    firstName : {
        type : String ,
        required : true ,
    },
    lastName : {
        type : String ,
        required : true ,
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        required : true ,
        default : "customer",
    },
    isBlocked : {
        type : Boolean,
        required : true ,
        default : false ,
    },
    img : {
        type : String ,
        required : false,
        default : "https://imgs.search.brave.com/qQ4QyYs2nCVAGKRGBXu3ZTrrjcQYoKnBybki-qB0Mac/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aWNvbnNob2NrLmNv/bS9pbWFnZS9Tb3Bo/aXN0aXF1ZS9HZW5l/cmFsL3VzZXI"
    }
    
})

const User = mongoose.model("user" , userSchema)  // param 1 = name of the collection that save in the database , param 2 = name of the Schema
export default User 