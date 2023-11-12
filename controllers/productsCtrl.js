import asyncHandler from "express-async-handler";
import Product from "../model/Products.js";

// @desc Create new product
// @route POST api/v1/products
// @access Private/Admin

export const createProductCtrl = asyncHandler(async (req, res) => {
    const { name, description, category, sizes, colors, user, price, totalQty, brand } =
        req.body;
    // product exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
        throw new Error("Product Already Exists")
    }
    //create the product
    const product = await Product.create({
        name, description, category, sizes, colors, price, totalQty, user: req.userAuthId, brand
    })
    res.json({
        status:"success",
        message:"Product created successfully",
        product
    })
})

// @desc Get all products
// @route GET /api/v1/products
// @access Public

export const getProductsCtrl = asyncHandler(async(req,res)=>{
    //Query
    let productQuery = Product.find();
    // search by name
    if(req.query.name){
        productQuery=productQuery.find({
            name:{$regex:req.query.name,$options:"i"}
        })
    }
    //Await the query
    const products = await productQuery;
    res.json({
        status:"success",
        products
    })
})