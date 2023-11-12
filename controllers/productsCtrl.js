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
    //filter by brand
    if(req.query.brand){
        productQuery=productQuery.find({
            brand:{$regex:req.query.brand,$options:"i"}
        })
    }
    //filter by category
    if(req.query.category){
        productQuery=productQuery.find({
            category:{$regex:req.query.category,$options:"i"}
        })
    }
    //filter by colors
    if(req.query.colors){
        productQuery=productQuery.find({
            colors:{$regex:req.query.colors,$options:"i"}
        })
    }
    //filter by sizes
    if(req.query.sizes){
        productQuery=productQuery.find({
            sizes:{$regex:req.query.sizes,$options:"i"}
        })
    }
    //filter by price
    if(req.query.price){
        const priceRange = req.query.price.split("-");
        productQuery = productQuery.find({
            price:{$gte:priceRange[0],$lte:priceRange[1]}
        })
    }
    //pagination
    //page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    //limit
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    //startIdx
    const startIndex = (page-1)*limit;
    //endIdx
    const endIdx = page * limit;
    //total
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(limit)

    //pagination results
    const pagination = {};
    if(endIdx < total){
        pagination.next = {
            page:page+1,
            limit
        }
    }
    if(startIndex>0){
        pagination.prev = {
            page: page-1,
            limit
        }
    }
    //Await the query
    const products = await productQuery;
    res.json({
        status:"success",
        message:"Products fetched successfully",
        total,
        pagination,
        results: products.length,
        products
    })
})