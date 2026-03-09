import User from "../models/user.js";
import bcrypt from "bcrypt" // Adding password hashing to the password
import jwt from "jsonwebtoken" // generating the web taken
import axios from "axios"
import dotenv from "dotenv"
import { use } from "react";
import nodemailer from "nodemailer"
import OTP from "../models/otp.js";

dotenv.config()

    // email : {
    //     type: String,
    //     required : true , 
    //     unique : true ,
    // },
    // firstName : {
    //     type : String ,
    //     required : true ,
    // },
    // lastName : {
    //     type : String ,
    //     required : true ,
    // },
    // password : {
    //     type : String,
    //     required : true,
    // },
    // role : {
    //     type : String,
    //     required : true ,
    //     default : "customer",
    // },
    // isBlocked : {
    //     type : Boolean,
    //     required : true ,
    //     default : false ,
    // },
    // img : {
    //     type : String ,
    //     required : false,
    //     default : "https://imgs.search.brave.com/qQ4QyYs2nCVAGKRGBXu3ZTrrjcQYoKnBybki-qB0Mac/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aWNvbnNob2NrLmNv/bS9pbWFnZS9Tb3Bo/aXN0aXF1ZS9HZW5l/cmFsL3VzZXI"
    // }


export async function loginWithGoogle(req , res){
    const token = req.body.accessToken;
    if(token==null){
        res.status(400).json({
            message:"Access Token is required"
        })
        return;
    }
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
        headers : {
            Authorization : `Bearer ${token}`
        }
    })
    console.log(response.data)
    const user = await User.findOne({
        email:response.data.email
    })

    if(user == null){
        const newUser = new User({
            email : response.data.email,
            firstName : response.data.given_name,
            lastName : response.data.family_name,
            password : "googleuser",
            img : response.data.picture
        })

        await newUser.save()

        const token = jwt.sign({
            email: newUser.email,
            firstName : newUser.firstName,
            lastName : newUser.lastName,
            role : newUser.role,
            img : newUser.img
        },
        process.env.JWT_KEY
    )
    res.json({
        message : "login successful",
        token : token,
        role : newUser.role
    })
    }else{
        const token = jwt.sign({
            email:user.email,
            firstName : user.firstname,
            lastName : user.lastName,
            role : user.role,
            img : user.img
        },
        process.env.JWT_KEY
    )
    res.json({
        message : "Login Successful",
        token : token,
        role : user.role
    })

    }
}


export function createUser(req, res){

    if(req.body.role =="admin"){
        if(req.user != null){
            if(req.user.role != "admin"){
                res.status(403).json({
                    message : "You are not authrized to create admin acounts"
                })
                return
            }

        }else{
            res.status(403).json({
                message : "You are not authorize to make a admin accounts. please loggin first"
            })
            return
        }
    }

    const hashPassword = bcrypt.hashSync(req.body.password,10)

    const user = new User({
        email : req.body.email,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        password : hashPassword,
        role : req.body.role,
    })
    user.save()
    .then(()=>{
        res.json({
            message : "Successfully user saved"
        })
    })
    .catch((error)=>{
        console.log(error)
        res.json({
            message : "Error occured "
        })
    })
}


export function loginUser(req , res){

    const email = req.body.email
    const password = req.body.password

    User.findOne({email : email}).then(
        (user)=>{
        if (user == null){
            res.status(404).json({
                message:"user not foud"
            })
        }else{
            const isPasswordCorrect = bcrypt.compareSync(password,user.password)

            if(isPasswordCorrect){
                // create taken using the jsonebtoken
                const token = jwt.sign({
                    firstName : user.firstName,
                    lastName : user.lastName,
                    email : user.email,
                    role : user.role,
                    img : user.img
                },process.env.JWT_KEY)


                res.json({
                    message : "loggon successfull",
                    token : token,
                    role : user.role
                })


            }else{
                res.status(401).json({
                    message : "Password is incorrect"
                })
            }
        }
    }).catch((error)=>{
        console.log(error)
        res.status(500).json({
            message : "Error occurred"
        })
    })
}

const transport = nodemailer.createTransport({
    service : "gmail",
    host : 'smtp.gmail.com',
    port : 587 , 
    auth : {
        user : process.env.EMAIL,
        pass : process.env.GOOGLE_EMAIL_PASSWORD,
    }
})

export async function resetPassword(req , res){
    const otp = req.body.otp
    const email = req.body.email
    const newPassword = req.body.newPassword

    const response = await OTP.findOne({
        email : email
    })

    if(response == null ){
        res.status(500).json({
            message : "No Otp was found "
        })
        return
    }
    if(otp == response.otp){
        await OTP.deleteMany({
            email: email
        })
        const hashedPassword = bcrypt.hashSync(newPassword, 10 )
        const response2 = await User.updateOne({
                email : email
            },
            {
                password : hashedPassword
            }
        )
        res.json({
            message : "Password reset successfully"
        })
    }else{
        res.status(403).json({
            message : "The otp was not matching"
        })
    }
}

export async function sendOTP(req , res ){
    //  qvvp guls drja mmyv
    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    const email = req.body.email
    if(email == null ){
        res.status(400).json({
            message : "Email is required"
        })
    return
    }

    const user = await User.findOne({
        email : email
    })
    if( user == null ){
        res.status(404).json({
            message : "User not found"
        })
    }

    // Delete old otps
    await OTP.deleteMany({
        email : email
    })

    const message = {
        from : "amanthasanduna@gmail.com",
        to : email,
        subject : "This is the email for the password reset in the crystol beauty",
        text : "This is Your password reset OTP : " + randomOTP
    }

    const otp = new OTP({
        email : email,
        otp : randomOTP
    })


    await otp.save()

    transport.sendMail(message,(error , info ) => {
        if(error){
            res.status(500).json({
                message : "Failed to send OTP",
                error : error
            });
        }else{
            res.json({
                message : "OTP send successfully",
                otp:randomOTP
            })
        }
    })
}

export function getUser(req,res){
    if(req.user == null ){
        res.status(403).json({
            message : "You are not autherized to log user detail"
        })  
    }else{
        res.json({
            ...req.user
        })
    }
}