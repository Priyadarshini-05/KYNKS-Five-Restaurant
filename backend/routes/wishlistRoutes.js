import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} from "../controllers/wishlistController.js";

const wishlistRoutes = express.Router();

wishlistRoutes.post("/add", protect, addToWishlist);
wishlistRoutes.get("/get", protect, getWishlist);
wishlistRoutes.delete("/remove/:menuId", protect, removeFromWishlist);

export default wishlistRoutes;
