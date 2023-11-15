import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createBrandCtrl,deleteBrandCtrl,getAllBrandsCtrl,getSingleBrandCtrl,updateBrandCtrl } from "../controllers/brandsCtrl.js";

const brandsRouter = express.Router();
brandsRouter.post("/",isLoggedIn,createBrandCtrl);
brandsRouter.get("/",getAllBrandsCtrl);
brandsRouter.get("/:id",getSingleBrandCtrl);
brandsRouter.delete("/:id",deleteBrandCtrl);
brandsRouter.put("/:id",updateBrandCtrl)

export default brandsRouter;