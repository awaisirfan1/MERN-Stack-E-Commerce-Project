import { server } from "@/main";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const token = Cookies.get("token");
  //   const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  const [cart, setCart] = useState([]);

  async function fetchCart() {
    const token = Cookies.get("token");
    if (!token || token === "null") {
      setCart([]);
      setTotalItem(0);
      setSubTotal(0);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/cart/all`, {
        headers: {
          token,
        },
      });
      setCart(data.cart);
      setTotalItem(data.sumOfQuantities);
      setSubTotal(data.subTotal);
    } catch (error) {
      if (error.response?.status === 401) {
        Cookies.remove("token", { path: "/" });
        setCart([]);
        setTotalItem(0);
        setSubTotal(0);
      }
      console.log(error);
    }
  }

  async function addToCart(product) {
    const token = Cookies.get("token");
    if (!token || token === "null") {
      toast.error("Please Login");
      return;
    }

    try {
      const { data } = await axios.post(
        `${server}/api/cart/add`,
        { product },
        {
          headers: {
            token,
          },
        },
      );
      toast.success(data.message);
      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function updateCart(action, id) {
    try {
      const { data } = await axios.post(
        `${server}/api/cart/update?action=${action}`,
        { id },
        {
          headers: {
            token,
          },
        },
      );
      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function removeFromCart(id) {
    try {
      const { data } = await axios.get(`${server}/api/cart/remove/${id}`, {
        headers: {
          token,
        },
      });

      toast.success(data.message);
      fetchCart();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);
  return (
    <CartContext.Provider
      value={{
        cart,
        subTotal,
        totalItem,
        setTotalItem,
        fetchCart,
        addToCart,
        updateCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const CartData = () => useContext(CartContext);
