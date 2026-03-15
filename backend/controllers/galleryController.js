import Gallery from "../models/galleryModel.js";
import { v2 as cloudinary } from "cloudinary";

export const uploadGalleryImage = async (req, res) => {
    try {
        const { experience } = req.body;
        const { id: userId } = req.user;

        if (!experience || !req.file) {
            return res.status(400).json({ message: "Image and experience description are required", success: false });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const galleryItem = await Gallery.create({
            user: userId,
            image: result.secure_url,
            experience,
        });

        res.status(201).json({
            message: "Experience shared successfully!",
            success: true,
            galleryItem,
        });
    } catch (error) {
        console.error("Gallery upload error:", error);
        res.status(500).json({ message: error.message || "Internal server error", success: false });
    }
};

export const getAllGalleryItems = async (req, res) => {
    try {
        const galleryItems = await Gallery.find().populate("user", "name").sort({ createdAt: -1 });
        res.status(200).json({ success: true, galleryItems });
    } catch (error) {
        console.error("Fetch gallery error:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        // Note: In a real app, check if user is admin or the owner
        await Gallery.findByIdAndDelete(id);
        res.status(200).json({ message: "Gallery item deleted", success: true });
    } catch (error) {
        console.error("Delete gallery error:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
