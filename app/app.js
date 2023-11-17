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

//db connection
dbConnect();
const app = express();

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

// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
const stripe = new Stripe(process.env.STRIPE_KEY)

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_TEMP

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


export default app;