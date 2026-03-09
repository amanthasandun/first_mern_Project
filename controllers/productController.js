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
        return
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
    .catch((err)=>{
        res.status(400).json({
            message : "Error got eccor while saving the file ",
            error : err
        })
    })
}


export async function deleteProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to delete product"
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
            message : "Failed to run server",
            error : err
        })
    }
}


export async function updateProduct(req , res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "you are not autherise to update"
        })
        return
    }

    const productId = req.params.productId
    const updatingData = req.body

    try{
        await Product.updateOne(
            {productId : productId} ,
            updatingData
        )

        res.json({
            message : "product updated successfully"
        })

    }catch(err){
        res.status(500).json({
            message : "Server error get occured",
            error : err
        })
    }
}

export async function getProductById(req, res){
    const productId = req.params.productId

    try{
        const product = await Product.findOne(
            {productId : productId}
        )

        if(product == null){
            res.status(404).json({
                message : "The product not found"
            })

            return
        }

        if(product.isAvailable){
            res.json(product)
        }else {
            if(!isAdmin(req)){
                res.status(404).json({
                    message : "Prduct not found"
                })
                return
            }else{
                res.json(product)
            }
        }

    }catch(err){
        res.status(500).json(
            {
                message : "internal server Error"
            }
        )
    }
}

export async function SearchProducts(req, res) {
    const searchQuery = req.params.query;

    try {
        const regex = new RegExp(searchQuery, "i");

        const products = await Product.find({
            $or: [
                { productName: regex },
                { altName: { $elemMatch: { $regex: regex } } }
            ],
            isAvailable : true
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err
        });
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