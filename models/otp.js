import mongoose from "mongoose";

const OTPSchema = mongoose.Schema({
    email : {
        require : true,
        type : String,
    },
    otp : {
        require : true,
        type : Number,
    }
})

const OTP = mongoose.model("OTP" , OTPSchema )  // param 1 = name of the collection that save in the database , param 2 = name of the Schema
export default OTP