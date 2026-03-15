import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import eventRoute from "./routes/eventRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import dotenv from "dotenv";
import connectCloudinary from "./config/cloudinary.js";
dotenv.config();
const app = express();
// database connection
connectDB();
connectCloudinary();
// middlewares
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://resturant-app-peach.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello from server V2");
});
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/event", eventRoute);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
