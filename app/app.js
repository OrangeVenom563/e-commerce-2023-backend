import dotevn from "dotenv";
dotevn.config();
import express from "express";
import Stripe from "stripe";
import dbConnect from "../config/dbConnect.js";
import {globalErrHandler, notFound} from "../middlewares/globalErrHandler.js"
import productsRouter from "../routes/productRoutes.js";
import userRoutes from "../routes/usersRoutes.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import brandsRouter from "../routes/brandsRouter.js";
import colorsRouter from "../routes/colorsRouter.js";
import reviewRouter from "../routes/reviewRouter.js";
import orderRouter from "../routes/ordersRouter.js";
import Order from "../model/Order.js";

//db connection
dbConnect();
const app = express();
// starting of stripe implementation
const stripe = new Stripe(process.env.STRIPE_KEY)
const endpointSecret = process.env.STRIPE_TEMP
app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  if(event.type === "checkout.session.completed"){
    // update the order
    const session = event.data.object;
    const {orderId} = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total;
    const currency = session.currency;
    const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
        paymentStatus,
        paymentMethod,
        totalPrice:totalAmount/100,
        currency
        }
    )
    console.log("Order Details:",order)
  }
  else{
    return
  }
  // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntentSucceeded = event.data.object;
//       // Then define and call a function to handle the event payment_intent.succeeded
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }
  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
// Ending of stripe implementation

//pass incoming data
app.use(express.json());

//routes
app.use("/api/v1/users/",userRoutes)
app.use("/api/v1/products/",productsRouter)
app.use("/api/v1/categories/",categoriesRouter)
app.use("/api/v1/brands/",brandsRouter)
app.use("/api/v1/colors/",colorsRouter)
app.use("/api/v1/reviews/",reviewRouter)
app.use("/api/v1/orders/",orderRouter)

//Err middleware
app.use(notFound)
app.use(globalErrHandler)

export default app;