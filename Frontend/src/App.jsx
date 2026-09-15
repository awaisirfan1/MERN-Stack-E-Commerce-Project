import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { userData } from "./Context/UserContext";
import Verify from "./pages/Verify";
import Loader from "./components/Loader";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import ProductPage from "./pages/ProductPage";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderPage from "./pages/OrderPage";
import AdminDashboard from "./pages/AdminDashboard";
import Payment from "./pages/Payment";
import OrderProcessing from "./pages/OrderProcessing";

const App = () => {
  const { isAuth, loading } = userData();

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={isAuth ? <Cart /> : <Login />} />
            <Route path="/checkout" element={isAuth ? <Checkout /> : <Login />} />
            <Route path="/payment/:id" element={isAuth ? <Payment /> : <Login />} />
            <Route path="/orders" element={isAuth ? <Orders /> : <Login />} />
            <Route path="/order/:id" element={isAuth ? <OrderPage /> : <Login />} />
            <Route path="/ordersuccess" element={isAuth ? <OrderProcessing /> : <Login />} />
            <Route path="/admin/dashboard" element={isAuth ? <AdminDashboard /> : <Login />} />
            <Route path="*" element={<NotFound/>} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
