import Order from "../models/order.js"
import Product from "../models/products.js"
import { isAdmin } from "./productController.js"

export async function createOrder(req,res){
    if (req.user == null){
        res.status(403).json({
            message : "Please login and try again"
        })
        return
    }

    const orderInfo = req.body

    if(orderInfo.name == null ){
        orderInfo.name = req.user.firstName +" "+ req.user.lastName
    }

    let orderId = "CBC000001"
    const lastOrder = await Order.find().sort({date : -1 }).limit(1)
    if(lastOrder.length > 0){
        const lastOrderId  = lastOrder[0].orderId
        const lastOrderNumberString  = lastOrderId.replace("CBC" , "")
        const lastOrderNumber = parseInt(lastOrderNumberString)
        const newOrderNumber = lastOrderNumber + 1
        const newOrderNumberString = String(newOrderNumber).padStart(5 , "0")
        orderId = "CBC" + newOrderNumberString
    }

    

    try{
        let total = 0 
        let labelledTotal = 0
        const products = []

        for (let i = 0 ; i < orderInfo.products.length ; i++){
            const item = await Product.findOne ({productId : orderInfo.products[i].productId})

            if(item == null){
                res.status(404).json({
                    message : "Product with productId "+orderInfo.products[i].productId + " is not found"
                })
                return
            }

            if(item.isAvailable == false){
                res.status(404).json({
                    message : "Product with productId " + orderInfo.products[i].productId + " is not available right now"
                })
                return
            }

            products[i] = {
                productInfo : {
                    productId : item.productId,
                    name : item.productName,
                    altNames : item.altNames,
                    description : item.description,
                    images : item.images,
                    laballedPrice : item.labelledPrice,
                    price : item.price
                },
                quantity : orderInfo.products[i].Qty
            }

            total = total + (item.price * orderInfo.products[i].Qty)
            labelledTotal = labelledTotal + (item.labelledPrice * orderInfo.products[i].Qty)
        }

        const order = new Order ({
        orderId : orderId,
        email : req.user.email,
        name : orderInfo.name,
        address : orderInfo.address,
        total : total ,
        labelledTotal : labelledTotal,
        phone : orderInfo.phone,
        products : products

    })

        const createOrder = await order.save()
        res.json({
            message : "Order created successfully",
            order : createOrder
        })

    }catch(err){
        res.status(500).json({
            message : "Failed to create order",
            error : err
        })
    }
    //get user information 
    //add current current users name if not provoided 
    // OrderId 
    // Create Order Object 
}

export async function UpdateOrderStatus(req, res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not autharize to update the user "
        });
        return
    }
    try{
        const orderId = req.params.orderId
        const status = req.params.status

        await Order.updateOne(
            {orderId : orderId},
            {status : status}
        )

        res.json({
            message : "Order updates succesfully"
        })
    }catch(e){
        res.status(500).json({
            message : "Failed to update to  the status"
        })
        console.log(e)
    }
}

export async function getOrders(req , res ){
    if(req.user==null ){
        res.status(403).json({
            message : "Please logion and try again"
        })
    }
    try{
        if(req.user.role == "admin"){
            const orders =await Order.find()
            res.json(orders)
        }else{
            const orders = await Order.find({email:req.user.email})
            res.json(orders)
        }
    }catch(e){
        res.status(500).json({
            message : "Failed to fettch the Orders",
            error:err
        })
    }
    
}