import express from "express";
import dotenv from "dotenv";
import connetDb from "./utils/db.js";
import { v2 as cloudinary } from 'cloudinary';

// importing routes
import userRouter from "./routes/User.js";
import productsRouter from "./routes/Product.js";
import cartRouter from "./routes/Cart.js";
import addressRouter from "./routes/Address.js";
import OrderRouter from "./routes/Order.js";


dotenv.config();

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET
    });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

// using routes
app.use("/api", userRouter);
app.use("/api", productsRouter);
app.use("/api", cartRouter);
app.use("/api", addressRouter);
app.use("/api", OrderRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connetDb();
});