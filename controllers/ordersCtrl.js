import dotenv from "dotenv";
dotenv.config()
import asyncHandler from "express-async-handler";
import Order from "../model/Order.js"
import Product from "../model/Products.js";
import User from "../model/User.js";
import Stripe from "stripe";

// @desc create orders
// @route POST /api/v1/orders
// @access private

//stripe
const stripe = new Stripe(process.env.STRIPE_KEY);
export const createOrderCtrl = asyncHandler(async(req,res)=>{
    //Get the payload
    const {orderItems, shippingAddress, totalPrice} = req.body;
    //Find the user
    const user = await User.findById(req.userAuthId);
    //Check if order is not empty
    if(orderItems?.length <= 0){
        throw new Error("No Order Items")
    }
    //Place/create order - save into DB
    const order = await Order.create({
        user:user?._id,
        orderItems,
        shippingAddress,
        totalPrice
    });
    //push order into user
    user.orders.push(order?._id);
    await user.save();
    //Update the product qty
    const products = await Product.find({_id:{$in:orderItems}})
    orderItems?.map(async(order)=>{
        const product = products?.find((product)=>{
            return product?._id?.toString() === order?._id?.toString();
        })
        if(product){
            product.totalSold += order.qty;
        }
        await product.save()
    })
    // make payment (stripe)
    const session = await stripe.checkout.sessions.create({
        line_items:[
            {
                price_data:{
                    currency:"inr",
                    product_data:{
                        name:"Hats",
                        description:"Best hat"
                    },
                    unit_amount: 10 * 100,
                },
                quantity:2
            }
        ],
        mode:"payment",
        success_url:"http://localhost:3000/success",
        cancel_url:"http://localhost:3000/cancel"
    })
    res.send({url:session.url})
    // res.json({
    //     success:true,
    //     message:"Order created",
    //     order,
    //     user
    // })
})