import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";
import {
    uploadGalleryImage,
    getAllGalleryItems,
    deleteGalleryItem,
} from "../controllers/galleryController.js";

const galleryRoutes = express.Router();

galleryRoutes.post("/upload", protect, upload.single("image"), uploadGalleryImage);
galleryRoutes.get("/all", getAllGalleryItems);
galleryRoutes.delete("/delete/:id", protect, deleteGalleryItem);

export default galleryRoutes;
