import express from 'express'
import bodyParser from "body-parser"   // use to handle the api requests to get the proper body 
import mongoose from "mongoose"

import productRouter from './Router/productRoutes.js'
import userRouter from './Router/userRoutes.js'
import jwt from "jsonwebtoken" // the scenarios with the web token 

const app = express()

app.use(bodyParser.json())

// Create a middleware for the read the taken and give the access
app.use((req , res , next)=>{
    const tokenString = req.header("Authorization")
    if (tokenString != null){
        const token = tokenString.replace("Bearer " ,"")
        //console.log(token)

        jwt.verify(token , "jayawardhanapura",         // param 1 = token that get ||| param2 = decrypt key that in usercontroller ||| param3 = the function after run this scenario 
            (err , decoded)=>{
                if (decoded != null){
                    console.log(decoded)
                    req.user = decoded
                    next()
                }else{
                    res.status(403).json({
                        message : "invalid token"
                    })
                }
            }
        )     
    }else{
        next() // we should use this for the run next function and pass the json
    }
})

mongoose.connect("mongodb+srv://sandunAman:2002@cluster0.p6otd8o.mongodb.net/?appName=Cluster0").then(()=>{
    console.log("successfully connected to the database")
}).catch(()=>{
    console.log("database connection got fail")
})

// mongodb+srv://sandunAman:2002@cluster0.p6otd8o.mongodb.net/?appName=Cluster0


app.use("/products" , productRouter)
app.use("/user" , userRouter)


// app.listen (param 1 , param 2)
// param 1 = we should enter the port number for this 
// param 2 = should enter function for this parameter. run after backend started

function successfullyStarted(){
    console.log("server is running on the port 3000")
}

app.listen(3000 , successfullyStarted )