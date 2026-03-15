import Wishlist from "../models/wishlistModel.js";
import Menu from "../models/menuModel.js";

export const addToWishlist = async (req, res) => {
    try {
        const { menuId } = req.body;
        const { id } = req.user;

        const menuItem = await Menu.findById(menuId);
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found", success: false });
        }

        const existingWishlistItem = await Wishlist.findOne({ user: id, menuItem: menuId });
        if (existingWishlistItem) {
            return res.status(400).json({ message: "Item already in wishlist", success: false });
        }

        const wishlistItem = new Wishlist({ user: id, menuItem: menuId });
        await wishlistItem.save();

        res.status(201).json({ message: "Item added to wishlist", success: true, wishlistItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { menuId } = req.params;

        const result = await Wishlist.findOneAndDelete({ user: userId, menuItem: menuId });
        if (!result) {
            return res.status(404).json({ message: "Wishlist item not found", success: false });
        }

        res.status(200).json({ message: "Item removed from wishlist", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const { id } = req.user;
        const wishlist = await Wishlist.find({ user: id }).populate("menuItem");
        res.status(200).json({ wishlist, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
