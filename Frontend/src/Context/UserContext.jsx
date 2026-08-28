import { server } from "@/main";
import axios from "axios";
import { createContext, useContext, useState } from "react";
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

  async function verifyUser(otp, navigate) {
    setBtnLoading(true);

    const email = localStorage.getItem("email");

    try {
      const { data } = await axios.post(`${server}/api/user/verify`, { email, otp });

      toast.success(data.message);
      setIsAuth(true);
      setUser(data.user);
      Cookies.set("token", data.token, {
        expires: 15,
        secure: true,
        path: "/",
      });
      localStorage.removeItem("email");
      setBtnLoading(false);
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to connect to the server",
      );
      setBtnLoading(false);
    }
  }

  return (
    <userContext.Provider
      value={{ user, loading, btnLoading, isAuth, setIsAuth, loginUser, verifyUser }}
    >
      {children}
      <Toaster />
    </userContext.Provider>
  );
};

export default UserProvider;

export const userData = () => useContext(userContext);
