import express from "express";

import {adminOnly,protect} from "../middlewares/authMiddleware.js"
import { getAllOrders, getUserOrders, placeOrder, updateOrderStatus, getSalesData } from "../controllers/orderController.js";
const orderRoutes=express.Router();
orderRoutes.post("/place",protect,placeOrder);
orderRoutes.get("/my-orders",protect,getUserOrders);
orderRoutes.get("/orders",adminOnly,getAllOrders);
orderRoutes.get("/sales-data",adminOnly,getSalesData);
orderRoutes.get("/test", (req, res) => res.json({ message: "Order route reached" }));
orderRoutes.put("/update-status/:orderId",adminOnly,updateOrderStatus);

console.log("Order routes initialized with /sales-data and /test");


export default orderRoutes;