import dotevn from "dotenv";
dotevn.config();
import express from "express";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/usersRoutes.js";

//db connection
dbConnect();
const app = express();

//pass incoming data
app.use(express.json());

//routes
app.use("/",userRoutes)

export default app;