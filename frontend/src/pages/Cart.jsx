import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";

const Cart = () => {
  const { cart, total, loading, updateQuantity, removeFromCart } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your cart is waiting!
        </h2>
        <p className="text-gray-600 mb-6">
          Please login to view and manage your cart.
        </p>
        <Link
          to="/login"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          Login to Continue
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Shopping Cart
        </h1>
        <Link
          to="/"
          className="text-indigo-600 font-medium hover:underline flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" /> Continue Shopping
        </Link>
      </div>

      {!cart?.items || cart.items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <ul className="divide-y divide-gray-100">
              {cart.items.map((item) => {
                if (!item.product) return null; // Defensive check
                return (
                  <li
                    key={item._id}
                    className="py-6 flex flex-col sm:flex-row gap-6 items-center"
                  >
                    <div className="h-24 w-24 flex-shrink-0 bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100?text=No+Img";
                        }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.product.category}
                          </p>
                        </div>
                        <p className="text-lg font-black text-gray-900">
                          ${item.product.price}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-l-lg transition disabled:opacity-50"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 font-semibold text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              if (item.quantity >= item.product.stock) {
                                alert("Cannot add more than available stock");
                                return;
                              }
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1,
                              );
                            }}
                            disabled={item.quantity >= item.product.stock}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-r-lg transition disabled:opacity-50"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="flex items-center text-sm font-medium text-red-500 hover:text-red-700 transition bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg"
                        >
                          <Trash2 size={16} className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="bg-gray-50 p-6 sm:p-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Total Amount (calculated by server)
              </p>
              <p className="text-3xl font-black text-gray-900">
                ${total?.toFixed(2) || "0.00"}
              </p>
            </div>
            <button className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
