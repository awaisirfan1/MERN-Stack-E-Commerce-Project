import { LogIn, ShoppingCart, User, LogOut, ShoppingBag } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
import { userData } from "../Context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CartData } from "@/Context/CartContext";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuth, logoutUser } = userData();

  const { totalItem, setTotalItem } = CartData();

  const logoutHandler = () => {
    logoutUser(navigate, setTotalItem);
    // Cookies.remove("token");
    // setIsAuth(false);
    // navigate("/login");
  };

  return (
    <div className="z-50 sticky top-0 bg-background/50 backdrop-blur-2xl border">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">QuickCart</h1>
        <ul className="flex justify-center items-center space-x-5">
          <li className="cursor-pointer" onClick={() => navigate("/")}>
            Home
          </li>
          <li className="cursor-pointer" onClick={() => navigate("/products")}>
            Products
          </li>
          <li
            className="cursor-pointer relative flex items-center"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 flex justify-center items-center rounded-full text-xs text-white font-bold">
              {totalItem ? totalItem : 0}
            </span>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition hover:bg-gray-100 dark:hover:bg-destructive/30"
                    aria-label={
                      isAuth ? "Open account menu" : "Open login menu"
                    }
                  />
                }
              >
                {isAuth ? <User size={25} /> : <LogIn size={25} />}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>

                  {!isAuth ? (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/login")}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => navigate("/orders")}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Your Orders
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={logoutHandler}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <ModeToggle/>
          {/* <li className="cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger>
                {isAuth ? <User /> : <LogIn />}
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {!isAuth ? (
                    <DropdownMenuItem onClick={() => navigate("/login")}>
                      Login
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/order")}>
                        Your Order
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={logoutHandler}>
                        Logout
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
