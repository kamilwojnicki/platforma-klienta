// frontend/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useClient } from "./ClientContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { selectedClient } = useClient();
  const [cart, setCart] = useState([]);

  // Przy zmianie zalogowanego klienta odczytujemy koszyk z localStorage
  useEffect(() => {
    if (selectedClient && selectedClient.recordId) {
      const storedCart = localStorage.getItem("cart_" + selectedClient.recordId);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [selectedClient]);

  // Za każdym razem, gdy koszyk się zmienia, zapisujemy go do localStorage dla danego klienta
  useEffect(() => {
    if (selectedClient && selectedClient.recordId) {
      localStorage.setItem("cart_" + selectedClient.recordId, JSON.stringify(cart));
    }
  }, [cart, selectedClient]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const updateCartItem = (suborderNumber, updatedPositions) => {
    setCart((prev) =>
      prev.map((cartItem) =>
        cartItem.suborder.suborderNumber === suborderNumber
          ? { ...cartItem, positions: updatedPositions }
          : cartItem
      )
    );
  };

  const removeFromCart = (suborderNumber) => {
    setCart((prev) =>
      prev.filter((cartItem) => cartItem.suborder.suborderNumber !== suborderNumber)
    );
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, updateCartItem, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
