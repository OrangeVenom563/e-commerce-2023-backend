import dotevn from "dotenv";
dotevn.config();
import express from "express";
import dbConnect from "../config/dbConnect.js";
import {globalErrHandler, notFound} from "../middlewares/globalErrHandler.js"
import productsRouter from "../routes/productRoutes.js";
import userRoutes from "../routes/usersRoutes.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import brandsRouter from "../routes/brandsRouter.js";
import colorsRouter from "../routes/colorsRouter.js";
import reviewRouter from "../routes/reviewRouter.js";

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

//Err middleware
app.use(notFound)
app.use(globalErrHandler)

export default app;