import express from "express"
import { createUser, loginUser } from "../controllers/userController.js"

const userRouter = express.Router()
userRouter.post("/" , createUser)
userRouter.post("/log" , loginUser)

export default userRouter 