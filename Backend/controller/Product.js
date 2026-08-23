import { Product } from "../models/Product.js";
import bufferGenerator from "../utils/bufferGenerator.js";
import TryCatch from "../utils/TryCatch.js";
import cloudinary from "cloudinary";

export const createProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { title, description, category, price, stock } = req.body || {};

  // if (!title || !description || !category || !price || !stock) {
  //   return res.status(400).json({
  //     message: "Missing required product fields",
  //   });
  // }

  const files = req.files;

  if (!files || files.length === 0)
    return res.status(400).json({
      message: "No file to upload!",
    });

  const imageUploadPromises = files.map(async (file) => {
    const fileBuffer = bufferGenerator(file);
    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);

    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  const uploadedImage = await Promise.all(imageUploadPromises);

  const product = await Product.create({
    title,
    description,
    category,
    price,
    stock,
    images: uploadedImage,
  });

  res.status(201).json({
    message: "Product Created!",
    product,
  });
});

export const getAllProducts = TryCatch(async (req, res) => {
  const { search, category, page = 1, sortByPrice } = req.query;

  const filter = {};

  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    filter.category = category;
  }

  const limit = 8;
  const skip = (Number(page) - 1) * limit;

  let sortOption = { createdAt: -1 };

  if (sortByPrice) {
    if (sortByPrice === "lowToHigh") {
      sortOption = { price: 1 };
    } else if (sortByPrice === "highToLow") {
      sortOption = { price: -1 };
    }
  }

  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(limit)
    .skip(skip);

  const categories = await Product.distinct("category");
  const newProduct = await Product.find().sort({ createdAt: -1 }).limit(4);
  const countProduct = await Product.countDocuments();
  const totalPages = Math.ceil(countProduct / limit);

  res.json({ products, categories, totalPages, newProduct });
});

export const getSingleProduct = TryCatch(async (req, res) => {
  const product = await Product.findById(req.params.id);

  const relatedProduct = await Product.find({
    category: product.category,
    _id: { $ne: product.id },
  }).limit(4);

  res.json({ product, relatedProduct });
});

// Product update
export const updateProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

  const { title, description, category, price, stock } = req.body || {};

  const updateFeilds = {};

  if (title) updateFeilds.title = title;
  if (description) updateFeilds.description = description;
  if (category) updateFeilds.category = category;
  if (price) updateFeilds.price = price;
  if (stock) updateFeilds.stock = stock;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateFeilds,
    { new: true, runValidators: true },
  );

  if (!updatedProduct)
    return res.status(404).json({
      message: "Product not Found",
    });

  res.json({
    message: "Product Update Successfully!",
    updatedProduct,
  });
});

// Product image update
export const updateProductImage = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "You are not admin",
    });

    const {id} = req.params;
    const files = req.files;

  if (!files || files.length === 0)
    return res.status(400).json({
      message: "No file to upload!",
    });

    const product = await Product.findById(id);

    if (!product)
    return res.status(404).json({
      message: "Product not Found",
    });

    const oldImage = product.images || [];

    for (const img of oldImage) {
      if(img.id){
        await cloudinary.v2.uploader.destroy(img.id);
      }
    }

    const imageUploadPromises = files.map(async (file) => {
    const fileBuffer = bufferGenerator(file);
    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);

    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  const uploadedImage = await Promise.all(imageUploadPromises);

  process.images = uploadedImage;

  await product.save();

  res.status(200).json({
    message: "Image Updated",
    product,
  });
});
