import Product from "../models/products.js"

export async function getProduct (req , res ){
    // Product.find()
    // .then((data)=>{
    //     res.json(data)
    // }).catch((err)=>{
    //     res.json({
    //         message : "failed to get products ",
    //         error : err
    //     })
    // })
    

    try{
        if(isAdmin(req)){
            const products = await Product.find()
            res.json(products)
        }else{
            const products = await Product.find({isAvailable : true})
            res.json(products)
        }
        
    }catch(err){
        res.json({
            message : "failed to get products",
            error : err
        })
    }
}

export function saveProduct(req , res){

    // // to check weathere there is an user 
    // if(req.user==null){
    //     res.status(403).json({
    //         message:"Unothrized access"
    //     })
    //     return
    // }

    // // to check weather that user is an admin
    // if (req.user.role != "admin"){
    //     res.status(403).json({
    //         message : "Before add the product login as admin"
    //     })
    //     return
    // }

    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not autharized to add products"
        })
    }

    // const product = new Product({
    //     name : req.body.name,
    //     price : req.body.price, 
    //     discription : req.body.discription,
    // })

    const product = new Product(
        req.body
    )

    product.save()
    .then (()=>{
        res.json({
            message : "succefully saved"
        })
    })
    .catch(()=>{
        res.json({
            message : "Error got eccor while saving the file "
        })
    })
}


export async function deleteProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            mesasge : "You are not authorized to dldt product"
        })
        return
    }


    try{
        // await Product.deleteOne({productId : req.body.productId})
        await Product.deleteOne({productId : req.params.productId})

        res.json({
            message : "Product deleted Successfully"
        })
    }catch(err){
        res.status(500).json({
            mesasge : "Failed to run server ",
            error : err
        })
    }
}

export function isAdmin(req){
    if (req.user == null){
        return false
    }

    if (req.user.role != "admin"){
        return false
    }

    return true
}