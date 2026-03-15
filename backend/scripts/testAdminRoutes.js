import express from 'express';
import adminRoutes from './routes/adminRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use("/api/admin", adminRoutes);

console.log("Admin routes registered:");
app._router.stack.forEach(layer => {
  if (layer.route) {
    console.log(layer.route.path);
  } else if (layer.name === "router") {
    layer.handle.stack.forEach(subLayer => {
      if (subLayer.route) {
        console.log("/api/admin" + subLayer.route.path);
      }
    });
  }
});
