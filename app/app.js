import dotevn from "dotenv";
dotevn.config();
import express from "express";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/usersRoutes.js";
import {globalErrHandler} from "../middlewares/globalErrHandler.js"

//db connection
dbConnect();
const app = express();

//pass incoming data
app.use(express.json());

//routes
app.use("/",userRoutes)

//Err middleware
app.use(globalErrHandler)

export default app;