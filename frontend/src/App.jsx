import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import MenuDetails from "./pages/MenuDetails";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import BookTable from "./pages/BookTable";
import MyBookings from "./pages/MyBookings";
import MyOrders from "./pages/MyOrders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Wishlist from "./pages/Wishlist";
import Gallery from "./pages/Gallery";
import Experience3D from "./pages/3DExperience";
import EventBooking from "./pages/EventBooking";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import AdminLayout from "./pages/admin/AdminLayout";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import AdminLogin from "./pages/admin/AdminLogin";
import AddCategory from "./pages/admin/AddCategory";
import AddMenu from "./pages/admin/AddMenu";
import Categories from "./pages/admin/Categories";
import Menus from "./pages/admin/Menus";
import Orders from "./pages/admin/Orders";
import Bookings from "./pages/admin/Bookings";
import EventBookings from "./pages/admin/EventBookings";
import Dashboard from "./pages/admin/Dashboard";
import DishSalesAnalytics from "./pages/admin/DishSalesAnalytics";
import MonthlySalesReport from "./pages/admin/MonthlySalesReport";
import AdminProfile from "./pages/admin/AdminProfile";


export const Server = import.meta.env.VITE_BACKEND_URL || "http://localhost:5002"; // Uses live backend if defined, otherwise localhost

const App = () => {
  const adminPath = useLocation().pathname.includes("admin");
  const { admin } = useContext(AppContext);
  return (
    <div>
      <Toaster />
      {!adminPath && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu-details/:id" element={<MenuDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/event-booking" element={<EventBooking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/3d-experience" element={<Experience3D />} />

        {/* admin routes  */}
        <Route path="/admin" element={admin ? <AdminLayout /> : <AdminLogin />}>
          <Route index element={admin ? <Dashboard /> : <AdminLogin />} />
          <Route
            path="add-category"
            element={admin ? <AddCategory /> : <AdminLogin />}
          />
          <Route
            path="edit-category/:id"
            element={admin ? <AddCategory /> : <AdminLogin />}
          />
          <Route
            path="add-menu"
            element={admin ? <AddMenu /> : <AdminLogin />}
          />
          <Route
            path="categories"
            element={admin ? <Categories /> : <AdminLogin />}
          />
          <Route path="menus" element={admin ? <Menus /> : <AdminLogin />} />
          <Route path="orders" element={admin ? <Orders /> : <AdminLogin />} />
          <Route path="analytics" element={admin ? <DishSalesAnalytics /> : <AdminLogin />} />
          <Route path="reports" element={admin ? <MonthlySalesReport /> : <AdminLogin />} />
          <Route
            path="bookings"

            element={admin ? <Bookings /> : <AdminLogin />}
          />
          <Route
            path="event-bookings"
            element={admin ? <EventBookings /> : <AdminLogin />}
          />
          <Route
            path="profile"
            element={admin ? <AdminProfile /> : <AdminLogin />}
          />
        </Route>
      </Routes>
      {!adminPath && <Footer />}
    </div>
  );
};
export default App;
