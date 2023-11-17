import express from "express";
import { createOrderCtrl } from "../controllers/ordersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRouter = express.Router();

orderRouter.post("/",isLoggedIn,createOrderCtrl);
export default orderRouter;