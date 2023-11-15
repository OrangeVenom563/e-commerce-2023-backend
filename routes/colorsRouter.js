import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createColorCtrl,deleteColorCtrl,getAllColorsCtrl,getSingleColorCtrl,updateColorCtrl } from "../controllers/colorsCtrl.js";

const brandsRouter = express.Router();
brandsRouter.post("/",isLoggedIn,createColorCtrl);
brandsRouter.get("/",getAllColorsCtrl);
brandsRouter.get("/:id",getSingleColorCtrl);
brandsRouter.delete("/:id",deleteColorCtrl);
brandsRouter.put("/:id",updateColorCtrl)

export default brandsRouter;