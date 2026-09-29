import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [] });
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data.cart || { items: [] });
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) throw new Error("Please login to add to cart");
    const { data } = await api.post("/cart", { productId, quantity });
    await fetchCart(); // Refresh cart to get total
    return data;
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await api.patch(`/cart/${productId}`, { quantity });
    await fetchCart();
    return data;
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    await fetchCart();
    return data;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
