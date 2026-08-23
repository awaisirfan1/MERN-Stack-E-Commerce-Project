import { json } from "express";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import TryCatch from "../utils/TryCatch.js";

export const addToCart = TryCatch(async (req, res) => {
  const { product } = req.body;

  const cart = await Cart.findOne({
    product: product,
    user: req.user._id,
  }).populate("product");

  if (cart) {
    if (cart.product.stock === cart.quantity)
      return res.status(400).json({
        message: "Out Of Stock",
      });

    cart.quantity = cart.quantity + 1;

    await cart.save();

    return res.json({
      message: "Added To Cart",
    });
  }

  const cartProd = await Product.findById(product);

  if (cartProd === 0)
    return res.status(400).json({
      message: "Out Of Stock",
    });

  await Cart.create({
    quantity: 1,
    product: product,
    user: req.user._id,
  });

  res.json({
    message: "Added To Cart",
  });
});

//Remove From Cart
export const removeFromCart = TryCatch(async (req, res) => {
  const cart = await Cart.findById(req.params.id);

  if (!cart)
    return res.status(404).json({
      message: "Cart item not found",
    });

  await cart.deleteOne();

  res.json({
    message: "Removed From Cart",
  });
});

//Update Cart
export const updateCart = TryCatch(async (req, res) => {
  const { action } = req.query;

  if (action === "inc") {
    const { id } = req.body;
    const cart = await Cart.findById(id).populate("product");

    if (cart.quantity < cart.product.stock) {
      cart.quantity++;
      await cart.save();
    } else {
      return res.status(400).json({
        message: "Out Of Stock",
      });
    }

    res.json({
      message: "Cart Updated!",
    });
  }

  if (action === "dec") {
    const { id } = req.body;
    const cart = await Cart.findById(id).populate("product");

    if (cart.quantity > 1) {
      cart.quantity--;
      await cart.save();
    } else {
      return res.status(400).json({
        message: "You have only one item",
      });
    }

    res.json({
      message: "Cart Updated!",
    });
  }
});

//fetch cart
export const fetchCart = TryCatch(async (req, res) => {
  const cart = await Cart.find({ user: req.user._id }).populate("product");

  const sumOfQuantities = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  let subTotal = 0;

  cart.forEach((i) => {
    const itemSubTotal = i.product.price * i.quantity;
    subTotal += itemSubTotal;
  });

  res.json({ cart, subTotal, sumOfQuantities });
});
