import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();

import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;
import { toast } from "react-hot-toast";
const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(() => {
    return JSON.parse(localStorage.getItem("admin")) || null;
  });
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);

  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [gallery, setGallery] = useState([]);

  const fetchCartData = async () => {
    try {
      const { data } = await axios.get("/api/cart/get");
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (cart?.items) {
      const total = cart.items.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0
      );
      setTotalPrice(total);
    }
  }, [cart]);
  const cartCount = cart?.items?.reduce(
    (acc, item) => acc + item.quantity,
    0 || 0
  );
  // 🔹 Add to Cart function
  const addToCart = async (menuId) => {
    try {
      const { data } = await axios.post("/api/cart/add", {
        menuId,
        quantity: 1,
      });
      if (data.success) {
        toast.success(data.message);
        fetchCartData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong!");
    }
  };
  // 🔹 Wishlist functions
  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get("/api/wishlist/get");
      if (data.success) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleWishlist = async (menuId) => {
    try {
      const isInWishlist = wishlist.some((item) => item.menuItem._id === menuId);
      if (isInWishlist) {
        const { data } = await axios.delete(`/api/wishlist/remove/${menuId}`);
        if (data.success) {
          toast.success("Removed from favorites");
          fetchWishlist();
        }
      } else {
        const { data } = await axios.post("/api/wishlist/add", { menuId });
        if (data.success) {
          toast.success("Added to favorites");
          fetchWishlist();
        }
      }
    } catch (error) {
      console.error("Toggle wishlist error:", error);
      toast.error("Something went wrong!");
    }
  };
  // 🔹 Gallery functions
  const fetchGallery = async () => {
    try {
      const { data } = await axios.get("/api/gallery/all");
      if (data.success) {
        setGallery(data.galleryItems);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadToGallery = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/gallery/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success(data.message);
        fetchGallery();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error("Gallery upload error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/all");

      if (data.success) {
        setCategories(data.categories);
      } else {
        console.log("Failed to fetch categories");
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };
  const fetchMenus = async () => {
    try {
      const { data } = await axios.get("/api/menu/all");

      if (data.success) {
        setMenus(data.menuItems);
      } else {
        console.log("Failed to fetch menus");
      }
    } catch (error) {
      console.log("Error fetching menus:", error);
    }
  };

  const isAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/is-auth");
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    isAuth();
    fetchCategories();
    fetchMenus();
    fetchGallery();

    // Add axios interceptor for handling 403 Forbidden
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 403) {
          setAdmin(null);
          localStorage.removeItem("admin");
          navigate("/admin");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchCartData();
      fetchWishlist();
    } else {
      setCart([]);
      setWishlist([]);
      setGallery([]);
    }
  }, [user]);
  const value = {
    navigate,
    loading,
    setLoading,
    user,
    setUser,
    authLoading,
    setAuthLoading,
    setCart,
    setWishlist,
    axios,
    admin,
    setAdmin,
    categories,
    fetchCategories,
    menus,
    fetchMenus,
    addToCart,
    cartCount,
    cart,
    totalPrice,
    fetchCartData,
    wishlist,
    fetchWishlist,
    toggleWishlist,
    gallery,
    fetchGallery,
    uploadToGallery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
