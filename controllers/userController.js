import { response } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt" // Adding password hashing to the password
import jwt from "jsonwebtoken" // generating the web taken

export function createUser(req, res){

    if(req.body.role =="admin"){
        if(req.user != null){
            if(req.user.role != "admin"){
                res.status(403).json({
                    mesage : "You are not authrized to create admin acounts"
                })
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

    User.findOne({email : email}).then((User)=>{
        console.log(User)
        if (User == null){
            res.status(404).json({
                message:"user not foud"
            })
        }else{
            const isPasswordCorrect = bcrypt.compareSync(password,User.password)

            if(isPasswordCorrect){
                // create taken using the jsonebtoken
                const token = jwt.sign({
                    firstName : User.firstName,
                    lastName : User.lastName,
                    email : User.email,
                    role : User.role,
                    img : User.img
                }, "jayawardhanapura")


                res.json({
                    message : "password is correct",
                    token : token
                })


            }else{
                res.json({
                    message : "Password is incorrect"
                })
            }
        }
    })
}