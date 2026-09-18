import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Loader from "../Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${server}/api/order/admin/all`, {
        headers: {
          token: Cookies.get("token"),
        },
      });
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/order/${orderId}`,
        { status },
        {
          headers: {
            token: Cookies.get("token"),
          },
        },
      );

      toast.success(data.message);
      fetchOrders();
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // const filterOrders = orders.filter((order) => {
  //   return (
  //     order.user.email.toLowerCase().includes(search.toLowerCase()) ||
  //     order._id.toLowerCase().includes(search.toLowerCase())
  //   );
  // });

  const filterOrders = orders.filter((order) => {
    const email = order.user?.email?.toLowerCase() || "";
    const orderId = order._id?.toLowerCase() || "";
    const text = search.toLowerCase();

    return email.includes(text) || orderId.includes(text);
  });
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Orders</h1>

      <Input
        placeholder="search by email or order id"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2"
      />

      {loading ? (
        <Loader />
      ) : filterOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Id</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    <Link to={`/order/${order._id}`}>{order._id}</Link>
                  </TableCell>
                  <TableCell>{order.user.email}</TableCell>
                  <TableCell>{order.subTotal}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-white ${order.status === "Pending" ? "bg-yellow-500" : order.status === "Shipped" ? "bg-blue-500" : "bg-green-500"}`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {moment(order.createdAt).format("DD MM YYYY")}
                  </TableCell>
                  <TableCell>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      className="w-37.5 px-3 py-2 border rounded-md"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>No Orders</p>
      )}
    </div>
  );
};

export default OrdersPage;
