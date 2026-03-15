import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
