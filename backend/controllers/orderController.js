import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import User from "../models/userModel.js";
import Menu from "../models/menuModel.js";
import Category from "../models/categoryModel.js";


export const placeOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const { address, paymentMethod } = req.body;
    if (!address)
      return res
        .status(400)
        .json({ message: "Delivery address is required", success: false });

    const cart = await Cart.findOne({ user: id }).populate("items.menuItem");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Your cart is empty" });

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );

    const newOrder = await Order.create({
      user: id,
      items: cart.items.map((i) => ({
        menuItem: i.menuItem._id,
        quantity: i.quantity,
      })),
      totalAmount,
      address,
      paymentMethod,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.user;
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });
    res.status(200).json({ orders, success: true });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("items.menuItem")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders, success: true });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "order status updated", success: true });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const getSalesData = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      // Only include delivered orders or you can include all
      { $match: { status: { $in: ["Pending", "Preparing", "Delivered"] } } }, 
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$totalAmount"] } } // It might be inaccurate if totalAmount covers whole order. Let's just track totalSold.
        },
      },
      {
        $lookup: {
          from: "menus", // The collection name in mongodb is usually pluralized lower case model name
          localField: "_id",
          foreignField: "_id",
          as: "menuDetails",
        },
      },
      { $unwind: "$menuDetails" },
      {
        $project: {
          _id: 0,
          dishName: "$menuDetails.name",
          totalSold: 1,
        },
      },
      { $sort: { totalSold: -1 } },
    ]);

    const highestSoldDish = salesData.length > 0 ? salesData[0] : null;

    res.status(200).json({
      success: true,
      salesData,
      highestSoldDish,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalDishes = await Menu.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false });
    
    const revenueData = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalDishes,
        totalUsers,
        totalRevenue
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching stats", success: false });
  }
};

export const getDishAnalytics = async (req, res) => {
  try {
    // 1. Monthly sales per dish
    const monthlySales = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            menuItem: "$items.menuItem"
          },
          totalSold: { $sum: "$items.quantity" }
        }
      },
      {
        $lookup: {
          from: "menus",
          localField: "_id.menuItem",
          foreignField: "_id",
          as: "menu"
        }
      },
      { $unwind: "$menu" },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          dishName: "$menu.name",
          totalSold: 1
        }
      },
      { $sort: { year: 1, month: 1, totalSold: -1 } }
    ]);

    // 2. Highest ordered dish for each month
    const monthlyTopDishes = [];
    const monthsProcessed = new Set();
    
    monthlySales.forEach(sale => {
      const monthKey = `${sale.year}-${sale.month}`;
      if (!monthsProcessed.has(monthKey)) {
        monthlyTopDishes.push(sale);
        monthsProcessed.add(monthKey);
      }
    });

    // 3. Get all dishes for dropdown
    const dishes = await Menu.find({}, "name _id");

    res.status(200).json({
      success: true,
      monthlySales,
      monthlyTopDishes,
      dishes
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching analytics", success: false });
  }
};

export const getMonthlySalesReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ success: false, message: "Year and month are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const matchStage = {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: "Delivered"
      }
    };

    // 1. Overall stats (Revenue, Orders)
    const overallStats = await Order.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    // 2. Dish Sales Stats
    const dishSales = await Order.aggregate([
      matchStage,
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          totalQuantity: { $sum: "$items.quantity" }
        }
      },
      {
        $lookup: {
          from: "menus",
          localField: "_id",
          foreignField: "_id",
          as: "menu"
        }
      },
      { $unwind: "$menu" },
      {
        $project: {
          _id: 0,
          dishId: "$_id",
          dishName: "$menu.name",
          totalQuantity: 1
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    // 3. Daily Sales Trend
    const dailyTrend = await Order.aggregate([
      matchStage,
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          _id: 0,
          day: "$_id",
          totalSales: 1,
          orderCount: 1
        }
      }
    ]);

    const stats = overallStats.length > 0 ? overallStats[0] : { totalOrders: 0, totalRevenue: 0 };
    const topDishes = dishSales.slice(0, 5);
    const mostOrderedDish = topDishes.length > 0 ? topDishes[0] : null;

    res.status(200).json({
      success: true,
      data: {
        stats,
        dishSales,
        topDishes,
        mostOrderedDish,
        dailyTrend
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error generating monthly report", success: false });
  }
};
