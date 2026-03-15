import express from 'express';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import eventRoute from './routes/eventRoute.js';
import adminRoutes from './routes/adminRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/event", eventRoute);
app.use("/api/admin", adminRoutes);

import fs from 'fs';
let output = '';
function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path + layer.route.path));
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path + (layer.regexp.source.replace('\\/?', '').replace('^', '').replace('(?=\\/|$)', ''))));
  } else if (layer.method) {
    output += `${layer.method.toUpperCase()} /${path.split('/').filter(Boolean).join('/')}\n`;
  }
}

app._router.stack.forEach(print.bind(null, ''));
fs.writeFileSync('backend/routes.txt', output);
console.log('Routes written to routes.txt');
