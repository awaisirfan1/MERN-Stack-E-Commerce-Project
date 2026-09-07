import { server } from "@/main";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

const userContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(() => Boolean(Cookies.get("token")));

  async function loginUser(email, navigate) {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });

      toast.success(data.message);
      localStorage.setItem("email", email);
      navigate("/verify");
      setBtnLoading(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to connect to the server",
      );
      setBtnLoading(false);
    }
  }

  async function verifyUser(otp, navigate, fetchCart) {
    setBtnLoading(true);

    const email = localStorage.getItem("email");

    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        email,
        otp,
      });

      toast.success(data.message);
      localStorage.clear();
      navigate("/");
      setBtnLoading(false);
      setIsAuth(true);
      setUser(data.user);
      Cookies.set("token", data.token, {
        expires: 15,
        secure: true,
        path: "/",
      });
      fetchCart();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to connect to the server",
      );
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    const token = Cookies.get("token");
    if (!token || token === "null") {
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token,
        },
      });

      setIsAuth(true);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      Cookies.remove("token", { path: "/" });
      setIsAuth(false);
      setLoading(false);
    }
  }

  function logoutUser(navigate, setTotalItem) {
    Cookies.remove("token", { path: "/" });
    setUser([]);
    setIsAuth(false);
    navigate("/login");
    toast.success("Logged Out");
    setTotalItem(0);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <userContext.Provider
      value={{
        user,
        loading,
        btnLoading,
        isAuth,
        setIsAuth,
        loginUser,
        verifyUser,
        logoutUser,
      }}
    >
      {children}
      <Toaster />
    </userContext.Provider>
  );
};

export default UserProvider;

export const userData = () => useContext(userContext);
