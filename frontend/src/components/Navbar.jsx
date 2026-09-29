import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, LogIn, UserPlus } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartItemCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-xl font-bold text-indigo-600 tracking-tight"
          >
            BuyMe
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">
                  Hello, {user.name}
                </span>
                <Link
                  to="/cart"
                  className="relative text-gray-600 hover:text-indigo-600 transition"
                >
                  <ShoppingCart size={24} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition"
                >
                  <LogOut size={18} className="mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                >
                  <LogIn size={18} className="mr-1" /> Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
                >
                  <UserPlus size={18} className="mr-1" /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
