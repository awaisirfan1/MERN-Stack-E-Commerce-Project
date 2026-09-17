import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserProvider from "./Context/UserContext";
import ProductProvider from "./Context/ProductContext";
import CartProvider from "./Context/CartContext";
import { ThemeProvider } from "./components/theme-provider";

export const server = "http://localhost:5000";

export const categories = [
  "Electronics",
  "Mobiles",
  "Laptops",
  "Tablets",
  "Smart Watches",
  "Headphones",
  "Cameras",
  "Televisions",
  "Gaming",
  "Computer Accessories",
  "Men's Clothing",
  "Women's Clothing",
  "Kids Clothing",
  "Shoes",
  "Bags",
  "Watches",
  "Jewelry",
  "Sunglasses",
  "Beauty",
  "Skincare",
  "Makeup",
  "Hair Care",
  "Perfumes",
  "Health",
  "Fitness",
  "Sports",
  "Toys",
  "Baby Products",
  "Pet Supplies",
  "Groceries",
  "Food & Beverages",
  "Home & Kitchen",
  "Furniture",
  "Home Decor",
  "Kitchen Appliances",
  "Home Appliances",
  "Lighting",
  "Tools",
  "Automotive",
  "Motorcycle Accessories",
  "Books",
  "Stationery",
  "Office Supplies",
  "Musical Instruments",
  "Garden & Outdoor",
  "Travel",
  "Luggage",
  "Mobile Accessories",
  "Computer Hardware",
  "Software",
];

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <ProductProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </ProductProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
);
