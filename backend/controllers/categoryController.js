import Category from "../models/categoryModel.js";
import { v2 as cloudinary } from "cloudinary";

export const addCategory = async (req, res) => {
  try {
    const { name, mainType } = req.body;
    if (!name || !req.file || !mainType) {
      return res
        .status(400)
        .json({
          message: "Name, main type and image are required",
          success: false,
        });
    }

    const alreadyExists = await Category.findOne({ name });
    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "Category already exists", success: false });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const newCategory = await Category.create({
      name,
      mainType,
      image: result.secure_url,
    });
    res.status(201).json({
      message: "Category added",
      success: true,
      category: newCategory,
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.log(error);

    return res.json({ message: "Internal server error", success: false });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mainType } = req.body;
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false });
    }
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      category.image = result.secure_url;
    }
    if (name) category.name = name;
    if (mainType) category.mainType = mainType;
    await category.save();
    res
      .status(200)
      .json({ message: "Category updated", success: true, category });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Internal server error", success: false });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    return res.json({ message: "Internal server error", success: false });
  }
};
