import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  createEventBooking,
  getUserEvents,
  getAllEvents,
  updateEventStatus,
} from "../controllers/eventController.js";

const eventRoutes = express.Router();

eventRoutes.post("/create", protect, createEventBooking);
eventRoutes.get("/my-events", protect, getUserEvents);
eventRoutes.get("/all-events", protect, adminOnly, getAllEvents);
eventRoutes.put("/update-status/:eventId", protect, adminOnly, updateEventStatus);

export default eventRoutes;
