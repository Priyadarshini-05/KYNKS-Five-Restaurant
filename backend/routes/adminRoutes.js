import express from "express";
import { adminOnly } from "../middlewares/authMiddleware.js";
import { getDashboardStats, getDishAnalytics, getMonthlySalesReport } from "../controllers/orderController.js";

const adminRoutes = express.Router();

adminRoutes.get("/stats", adminOnly, getDashboardStats);
adminRoutes.get("/dish-sales", adminOnly, getDishAnalytics);
adminRoutes.get("/monthly-sales-report", adminOnly, getMonthlySalesReport);
adminRoutes.get("/ping", (req, res) => res.json({ message: "pong" }));

export default adminRoutes;
