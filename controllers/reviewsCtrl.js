import asyncHandler from "express-async-handler";
import Product from "../model/Products.js";
import Review from "../model/Review.js";

// @desc Create new review
// @route POST /api/v1/reviews
// @access Private/Admin

export const createReviewCtrl = asyncHandler(async(req,res)=>{
    const {message,rating} = req.body;
    //find the product
    const {productId} = req.params;
    const productFound = await Product.findById(productId).populate("reviews");
    if(!productFound){
        throw new Error("Product Not Found")
    }
    //check if user already reviewed this product
    const hasReviewed = productFound?.reviews?.find((review)=>{
        console.log(review)
        return review?.user?.toString() === req?.userAuthId?.toString()
    })
    if(hasReviewed){
        throw new Error("You have already reviewed this product")
    }
    //create review
    const review = await Review.create({
        message,rating,product:productFound?._id,user:req.userAuthId
    })
    // push review into product found
    productFound.reviews.push(review?._id);
    //resave
    await productFound.save();
    res.status(201).json({
        success:true,
        message:"Review created successfully"
    })
})