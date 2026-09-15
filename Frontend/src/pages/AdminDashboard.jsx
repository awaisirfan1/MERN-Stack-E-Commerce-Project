import HomePage from "@/components/Admin/HomePage";
import InfoPage from "@/components/Admin/InfoPage";
import OrdersPage from "@/components/Admin/OrdersPage";
import React from "react";

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPageContent = () => {
    switch (selectedPage) {
      case "home":
        return <HomePage />;
      case "orders":
        return <OrdersPage />;
      case "info":
        return <InfoPage />;

      default:
        return <HomePage />;
    }
  };

  return <div className="flex min-h-screen">
    {/* sidebar */}
    <div className={`${sidebarOpen? "translate-x-0": "-translate-x-full"} fixed lg:relative lg:translate-x-0 h-full shadow-lg transition-transform duration-300 bg-background/50 border-b backdrop-blur z-50`}>
    <div className="flex flex-col h-full p-4">
        <h1 className="text-lg font-bold mb-4">Admin Panel</h1>
    </div>
    </div>
  </div>;
};

export default AdminDashboard;