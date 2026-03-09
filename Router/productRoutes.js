import express from "express"
import { deleteProduct, getProduct, getProductById, saveProduct, SearchProducts, updateProduct } from "../controllers/productController.js"

const productRouter = express.Router()

productRouter.get("/" , getProduct)
productRouter.post("/" , saveProduct)
//productRouter.delete("/" , deleteProduct)
productRouter.delete("/:productId" , deleteProduct)
productRouter.put("/:productId",updateProduct)
productRouter.get("/:productId",getProductById)
productRouter.get("/search/:query" , SearchProducts)

export default productRouter