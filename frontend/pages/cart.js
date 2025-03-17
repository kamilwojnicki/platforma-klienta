// frontend/pages/cart.js
import { useCart } from "../context/CartContext";
import CartItem from "../components/Cart/CartItem";
import { Button, Box, Typography } from "@mui/material";
import { useState } from "react";

export default function Cart() {
  const { cart, removeFromCart, setCart } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setPlacingOrder(true);
    setErrorMsg("");

    try {
      // Dla każdego podzamówienia w koszyku wysyłamy żądanie do endpointu
      const results = await Promise.all(
        cart.map(async (suborder) => {
          // Załóżmy, że w obiekcie suborder mamy strukturę:
          // { suborder: { id, suborderNumber, ... }, positions: [...] }
          const response = await fetch("/api/newOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              originalOrderId: suborder.suborder.id,
              // Możesz przekazać dodatkowe dane, np. pozycje:
              items: suborder.positions,
            }),
          });
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Błąd przy składaniu domówienia");
          }
          return response.json();
        })
      );
      // Jeśli wszystkie domówienia zostały poprawnie złożone, czyścimy koszyk
      setCart([]);
      alert("Domówienia zostały złożone pomyślnie!");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Twój koszyk
      </Typography>
      {cart.length === 0 ? (
        <Typography variant="body1">Koszyk jest pusty</Typography>
      ) : (
        cart.map((suborder) => (
          <CartItem key={suborder.suborder.suborderNumber} suborder={suborder} onRemove={removeFromCart} />
        ))
      )}
      {cart.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlaceOrder}
            disabled={placingOrder}
          >
            {placingOrder ? "Składanie zamówienia..." : "Złóż zamówienie"}
          </Button>
        </Box>
      )}
      {errorMsg && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {errorMsg}
        </Typography>
      )}
    </Box>
  );
}
