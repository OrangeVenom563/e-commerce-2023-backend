import dotevn from "dotenv";
dotevn.config();
import express from "express";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/usersRoutes.js";
import {globalErrHandler, notFound} from "../middlewares/globalErrHandler.js"
import productsRouter from "../routes/productRoutes.js";

//db connection
dbConnect();
const app = express();

//pass incoming data
app.use(express.json());

//routes
app.use("/api/v1/users/",userRoutes)
app.use("/api/v1/products/",productsRouter)

//Err middleware
app.use(notFound)
app.use(globalErrHandler)

export default app;