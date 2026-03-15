import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import Menu from '../models/menuModel.js';
import Order from '../models/orderModel.js';
import Category from '../models/categoryModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // 1. Ensure Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'priyadarshini@gmail.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('1q2w3e', 10);
      admin = await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true
      });
      console.log('Created Admin User');
    } else {
      admin.isAdmin = true;
      await admin.save();
      console.log('Admin User verified');
    }

    // 2. Sample Categories
    let categories = await Category.find();
    if (categories.length === 0) {
      categories = await Category.insertMany([
        { name: 'Appetizers', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=200' },
        { name: 'Main Course', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200' },
        { name: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=200' }
      ]);
      console.log('Created Categories');
    }

    // 3. Sample Menu Items
    let menuItems = await Menu.find();
    if (menuItems.length === 0) {
      menuItems = await Menu.insertMany([
        { name: 'Truffle Pasta', description: 'Creamy pasta with black truffle', price: 25, category: categories[1]._id, image: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&q=80&w=400' },
        { name: 'Grilled Salmon', description: 'Atlantic salmon with herbs', price: 30, category: categories[1]._id, image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=400' },
        { name: 'Margherita Pizza', description: 'Classic tomato and mozzarella', price: 18, category: categories[1]._id, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=400' },
        { name: 'Caesar Salad', description: 'Fresh crisp salad', price: 12, category: categories[0]._id, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=400' },
        { name: 'Chocolate Lava Cake', description: 'Rich chocolate dessert', price: 10, category: categories[2]._id, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400' }
      ]);
      console.log('Created Menu Items');
    }

    // 4. Sample Orders Over Last 6 Months
    const orders = [];
    const now = new Date();
    
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 15);
      
      // Create 5-10 orders per month
      const orderCount = Math.floor(Math.random() * 5) + 5;
      for (let j = 0; j < orderCount; j++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const createdAt = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
        
        const items = [];
        const itemCount = Math.floor(Math.random() * 3) + 1;
        let totalAmount = 0;
        
        for (let k = 0; k < itemCount; k++) {
          const menuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;
          items.push({ menuItem: menuItem._id, quantity });
          totalAmount += menuItem.price * quantity;
        }

        orders.push({
          user: admin._id,
          items,
          totalAmount,
          address: '123 Test Street',
          status: 'Delivered',
          paymentMethod: 'Cash on Delivery',
          createdAt
        });
      }
    }

    await Order.deleteMany({ status: 'Delivered' }); // Optional: clear old mock data
    await Order.insertMany(orders);
    console.log(`Successfully seeded ${orders.length} orders across 6 months`);

    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
