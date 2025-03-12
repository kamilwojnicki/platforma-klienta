// frontend/context/CartContext.js
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Dodawanie nowego elementu do koszyka
  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  // Edycja istniejącego elementu w koszyku (po suborderNumber)
  const updateCartItem = (suborderNumber, updatedPositions) => {
    setCart((prev) =>
      prev.map((cartItem) => {
        if (cartItem.suborder.suborderNumber === suborderNumber) {
          return { ...cartItem, positions: updatedPositions };
        }
        return cartItem;
      })
    );
  };

  // Usuwanie
  const removeFromCart = (suborderNumber) => {
    setCart((prev) => prev.filter(item => item.suborder.suborderNumber !== suborderNumber));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItem, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
