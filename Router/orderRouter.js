import express from "express"
import { createOrder, getOrders, UpdateOrderStatus } from "../controllers/orderController.js";

const orderRouter = express.Router();
orderRouter.post("/" ,createOrder )
orderRouter.get("/",getOrders)
orderRouter.put("/:orderId/:status" , UpdateOrderStatus)
export default orderRouter